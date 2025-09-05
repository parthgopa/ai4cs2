import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const CapitalRaisingAdvisoryAgreement = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Form data for all steps
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    consultantName: '',
    consultantAddress: '',
    effectiveDate: '',
    duration: '',
    scopeOfServices: '',
    companyCountry: '',
    currency: '',
    customCurrency: false,
    minGuaranteedINR: '',
    feeStructure: '',
    terminationClause: '',
    confidentialityClause: 'standard',
    boardMeetingDate: '',
    resolutionNumber: '',
    resolutionExtract: ''
  });

  // Loading and response states
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Currency mapping based on country
  const currencyMapping = {
    'India': 'INR',
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'Germany': 'EUR',
    'France': 'EUR',
    'Italy': 'EUR',
    'Spain': 'EUR',
    'Japan': 'JPY',
    'China': 'CNY',
    'Australia': 'AUD',
    'Canada': 'CAD',
    'Singapore': 'SGD',
    'Hong Kong': 'HKD',
    'Switzerland': 'CHF'
  };

  // Step configuration
  const steps = [
    { id: 1, title: 'Basic Agreement Details', fields: ['companyName', 'companyAddress', 'consultantName', 'consultantAddress', 'effectiveDate', 'duration', 'scopeOfServices'] },
    { id: 2, title: 'Country & Currency', fields: ['companyCountry', 'currency'] },
    { id: 3, title: 'Fee Structure & Legal Terms', fields: ['feeStructure', 'terminationClause', 'confidentialityClause'] },
    { id: 4, title: 'Board Resolution', fields: ['boardMeetingDate', 'resolutionNumber', 'resolutionExtract'] }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-detect currency when country changes
      if (name === 'companyCountry') {
        const detectedCurrency = currencyMapping[value] || 'USD';
        newData.currency = detectedCurrency;
        newData.customCurrency = false;
      }
      
      return newData;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      generateAgreement();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    const currentStepConfig = steps[currentStep - 1];
    return currentStepConfig.fields.every(field => {
      if (field === 'minGuaranteedINR') {
        return formData.currency === 'INR' || formData[field].trim() !== '';
      }
      return formData[field].trim() !== '';
    });
  };

  const generateAgreement = async () => {
    setLoading(true);
    setResponse('');

    const arbitrationClause = formData.companyCountry === 'India' 
      ? 'Indian Arbitration & Jurisdiction clause under the Arbitration and Conciliation Act, 2015'
      : 'International Arbitration clause under UNCITRAL Rules with seat at Singapore';

    const currencyClause = formData.currency !== 'INR' && formData.minGuaranteedINR
      ? `Consultant shall be paid in ${getCurrencyFullName(formData.currency)} (${formData.currency}), ensuring receipt of not less than INR ${formData.minGuaranteedINR} equivalent, computed at prevailing exchange rate on the date of remittance.`
      : `Payment shall be made in ${getCurrencyFullName(formData.currency)} (${formData.currency}).`;

    const prompt = `Draft a comprehensive Capital Raising Advisory Agreement between a Company and a Consultant with the following details:

AGREEMENT DETAILS:
- Company Name: ${formData.companyName}
- Company Registered Office: ${formData.companyAddress}
- Consultant Name: ${formData.consultantName}
- Consultant Address: ${formData.consultantAddress}
- Effective Date: ${formData.effectiveDate}
- Duration/Term: ${formData.duration}
- Scope of Services: ${formData.scopeOfServices}
- Company Country: ${formData.companyCountry}

FINANCIAL TERMS:
- Currency: ${getCurrencyFullName(formData.currency)} (${formData.currency})
- Fee Structure: ${formData.feeStructure}
- Payment Clause: ${currencyClause}

LEGAL CLAUSES:
- Termination: ${formData.terminationClause}
- Confidentiality: ${formData.confidentialityClause === 'standard' ? 'Standard confidentiality provisions' : formData.confidentialityClause}
- Arbitration & Jurisdiction: ${arbitrationClause}

BOARD RESOLUTION DETAILS:
- Board Meeting Date: ${formData.boardMeetingDate}
- Resolution Number: ${formData.resolutionNumber || 'Not specified'}
- Resolution Extract: ${formData.resolutionExtract || 'Generic approval for appointment of consultant for capital raising advisory services'}

DRAFTING REQUIREMENTS:
1. Include proper preamble with reference to Board Resolution approving consultant's appointment
2. Professional, legally sound, internationally acceptable style
3. Comprehensive terms covering scope, obligations, payment, confidentiality, termination
4. Appropriate governing law and dispute resolution clauses
5. Standard boilerplate clauses for enforceability

Please draft a complete, professional Capital Raising Advisory Agreement that can be executed immediately.`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
            setIsCompleted(true);
          } else {
            setResponse("Sorry, we couldn't generate the agreement. Please try again.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the agreement. Please try again later.");
      console.error("Error:", error);
    }
  };

  const getCurrencyFullName = (currencyCode) => {
    const currencyNames = {
      'INR': 'Indian Rupees',
      'USD': 'U.S. Dollars',
      'GBP': 'British Pounds Sterling',
      'EUR': 'Euros',
      'JPY': 'Japanese Yen',
      'CNY': 'Chinese Yuan',
      'AUD': 'Australian Dollars',
      'CAD': 'Canadian Dollars',
      'SGD': 'Singapore Dollars',
      'HKD': 'Hong Kong Dollars',
      'CHF': 'Swiss Francs'
    };
    return currencyNames[currencyCode] || currencyCode;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <h5 className="text-primary mb-3">Company Information</h5>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter company name"
                  required
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Registered Office Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter complete registered office address"
                  required
                />
              </Form.Group>
            </div>

            <div className="mb-4">
              <h5 className="text-primary mb-3">Consultant Information</h5>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Consultant Name</Form.Label>
                <Form.Control
                  type="text"
                  name="consultantName"
                  value={formData.consultantName}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter consultant/advisory firm name"
                  required
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Consultant Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="consultantAddress"
                  value={formData.consultantAddress}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter consultant's complete address"
                  required
                />
              </Form.Group>
            </div>

            <div className="mb-4">
              <h5 className="text-primary mb-3">Agreement Terms</h5>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Effective Date of Agreement</Form.Label>
                <Form.Control
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Duration/Term of Engagement</Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 12 months, 2 years, until completion of fundraising"
                  required
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Scope of Services</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="scopeOfServices"
                  value={formData.scopeOfServices}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Describe the nature of advisory work (e.g., fundraising strategy, investor identification, due diligence support, etc.)"
                  required
                />
              </Form.Group>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Company Country of Incorporation</Form.Label>
              <Form.Select
                name="companyCountry"
                value={formData.companyCountry}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select Country</option>
                {Object.keys(currencyMapping).map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            
            {formData.companyCountry && (
              <Form.Group className="form-group">
                <Form.Label className="form-label">
                  Currency (Default for {formData.companyCountry}: {currencyMapping[formData.companyCountry] || 'USD'})
                </Form.Label>
                <div className="d-flex align-items-center gap-3">
                  <Form.Control
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Currency code (e.g., USD, EUR, INR)"
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      const defaultCurrency = currencyMapping[formData.companyCountry] || 'USD';
                      setFormData(prev => ({ ...prev, currency: defaultCurrency }));
                    }}
                  >
                    Use Default
                  </Button>
                </div>
                <Form.Text className="text-muted">
                  You can keep the default currency or change it as needed.
                </Form.Text>
              </Form.Group>
            )}

            {formData.currency && formData.currency !== 'INR' && (
              <Form.Group className="form-group">
                <Form.Label className="form-label">Minimum Guaranteed INR Value</Form.Label>
                <Form.Control
                  type="text"
                  name="minGuaranteedINR"
                  value={formData.minGuaranteedINR}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 10,00,000 (to protect against exchange fluctuations)"
                />
                <Form.Text className="text-muted">
                  Optional: Specify minimum INR equivalent to protect against exchange rate fluctuations.
                </Form.Text>
              </Form.Group>
            )}
          </>
        );

      case 3:
        return (
          <>
            <div className="mb-4">
              <h5 className="text-primary mb-3">Fee Structure</h5>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Fee/Remuneration Structure</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="feeStructure"
                  value={formData.feeStructure}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Describe the fee structure (e.g., fixed retainer, success fee percentage, milestone-based payments, etc.)"
                  required
                />
                <Form.Text className="text-muted">
                  Include details about retainer fees, success fees, payment milestones, etc.
                </Form.Text>
              </Form.Group>
            </div>

            <div className="mb-4">
              <h5 className="text-primary mb-3">Legal Terms</h5>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Termination Clause</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="terminationClause"
                  value={formData.terminationClause}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Specify notice period and termination conditions (e.g., 30 days written notice, termination for cause, etc.)"
                  required
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Confidentiality Clause</Form.Label>
                <Form.Select
                  name="confidentialityClause"
                  value={formData.confidentialityClause}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="standard">Standard Confidentiality Provisions</option>
                  <option value="custom">Custom Confidentiality Terms</option>
                </Form.Select>
                {formData.confidentialityClause === 'custom' && (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="confidentialityClause"
                    value={formData.confidentialityClause}
                    onChange={handleInputChange}
                    className="form-control mt-2"
                    placeholder="Enter specific confidentiality requirements"
                  />
                )}
              </Form.Group>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Board Meeting Date </Form.Label>
              <Form.Control
                type="date"
                name="boardMeetingDate"
                value={formData.boardMeetingDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Resolution Number</Form.Label>
              <Form.Control
                type="text"
                name="resolutionNumber"
                value={formData.resolutionNumber}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., Resolution No. 2024/01 (Optional)"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Extract of Resolution</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="resolutionExtract"
                value={formData.resolutionExtract}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter the board resolution text or leave blank for generic approval text"
              />
              <Form.Text className="text-muted">
                If left blank, a generic approval text will be used.
              </Form.Text>
            </Form.Group>
          </>
        );

      default:
        return null;
    }
  };

  if (isCompleted && response) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <h1 className="card-title" style={{ marginBottom: '6px' }}>Capital Raising Advisory Agreement</h1>
            <h2 className="card-title" style={{ marginBottom: '12px' }}>{formData.companyName} & {formData.consultantName}</h2>
            <Card className="output-card">
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                    alert('Copied to clipboard!');
                  }}
                >
                  <FaCopy className="me-1" />
                  <span className="d-none d-sm-inline">Copy to Clipboard</span>
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    const { generatePDF } = PDFGenerator({
                      content: response,
                      fileName: `${formData.companyName}-capital-raising-advisory-agreement.pdf`,
                      title: `Capital Raising Advisory Agreement`
                    });
                    generatePDF();
                  }}
                  className="me-2"
                >
                  <FaFilePdf className="me-1" />
                  <span className="d-none d-sm-inline">Download PDF</span>
                </Button>
                <Button
                  variant="outline-success"
                  onClick={() => {
                    const { generateWord } = WordGenerator({
                      content: response,
                      fileName: `${formData.companyName}-capital-raising-advisory-agreement.docx`,
                      title: `Capital Raising Advisory Agreement`
                    });
                    generateWord();
                  }}
                  className="me-2"
                >
                  <FaFileWord className="me-1" />
                  <span className="d-none d-sm-inline">Download Word</span>
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setIsCompleted(false);
                    setResponse('');
                    setCurrentStep(1);
                  }}
                >
                  Start New Agreement
                </Button>
              </div>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
              </div>
              <AIDisclaimer variant="light" />
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Capital Raising Advisory Agreement Generator</h2>
            
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Step {currentStep} of {steps.length}</span>
                <span className="text-muted">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
              </div>
              <div className="progress" style={{ height: '4px' }}>
                <div 
                  className="progress-bar" 
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h4 className="mb-3">{steps[currentStep - 1].title}</h4>
            
            <Form>
              {renderStepContent()}
              
              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <FaArrowLeft className="me-2" />
                  Previous
                </Button>
                
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!isStepValid() || loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="spinner me-2" />
                      Generating Agreement...
                    </>
                  ) : currentStep === steps.length ? (
                    <>
                      <FaCheck className="me-2" />
                      Generate Agreement
                    </>
                  ) : (
                    <>
                      Next
                      <FaArrowRight className="ms-2" />
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CapitalRaisingAdvisoryAgreement;
