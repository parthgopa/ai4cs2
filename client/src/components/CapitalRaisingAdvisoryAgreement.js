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
    companyCountry: '',
    consultantName: '',
    consultantAddress: '',
    consultantCountry: '',
    effectiveDate: '',
    duration: '',
    scopeOfServices: '',
    currency: '',
    changeCurrency: 'no',
    minINRValue: '',
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
  const currencyMap = {
    'India': 'INR',
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'Eurozone': 'EUR',
    'Japan': 'JPY'
    // Add more mappings as needed
  };

  // Handle input changes with currency logic
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      // Set default currency based on company country
      if (name === 'companyCountry') {
        const defaultCurrency = currencyMap[value] || 'USD';
        updatedData.currency = defaultCurrency;
      }

      // Reset min INR value if currency is INR
      if (name === 'currency' && value === 'INR') {
        updatedData.minINRValue = '';
      }

      return updatedData;
    });
  };

  // Navigation between steps
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    handleSubmit();
  };

  // Form submission with arbitration logic
  const handleSubmit = async () => {
    setLoading(true);
    setResponse(null);

    // Arbitration & Jurisdiction logic
    let arbitrationClause = '';
    if (formData.companyCountry === 'India' && formData.consultantCountry === 'India') {
      arbitrationClause = 'Indian Arbitration & Jurisdiction clause';
    } else {
      arbitrationClause = 'International Arbitration clause (UNCITRAL Rules, seat = Singapore)';
    }

    const fullPrompt = `
      I want to draft a Capital Raising Advisory Agreement between a Company and a Consultant.
      Follow this exact process:

      Variables:
      1. Company Name: ${formData.companyName}
      2. Company Registered Office Address: ${formData.companyAddress}
      3. Company Country: ${formData.companyCountry}
      4. Consultant Name: ${formData.consultantName}
      5. Consultant Address: ${formData.consultantAddress}
      6. Consultant Country: ${formData.consultantCountry}
      7. Effective Date of Agreement: ${formData.effectiveDate}
      8. Duration / Term of Engagement: ${formData.duration}
      9. Scope of Services: ${formData.scopeOfServices}
      10. Fee / Remuneration Structure: ${formData.feeStructure}
      11. Termination Clause: ${formData.terminationClause}
      12. Confidentiality Clause: ${formData.confidentialityClause}
      13. Board Resolution Details:
          - Date of Board Meeting: ${formData.boardMeetingDate}
          - Resolution Number: ${formData.resolutionNumber}
          - Extract of Resolution: ${formData.resolutionExtract || 'Generic approval text'}
      Currency: ${formData.currency}
      ${formData.currency !== 'INR' ? `Minimum Guaranteed INR Value: ${formData.minINRValue}` : ''}
      Arbitration & Jurisdiction: ${arbitrationClause}

      Agreement Drafting Rules:
      1. Preamble / Recitals must include reference to Board Resolution approving Consultant’s appointment.
      2. Fee & Payment Terms must explicitly state Currency in full + code (e.g., “U.S. Dollars (USD)”, “Indian Rupees (INR)”).
      3. If foreign currency, include: “Consultant shall be paid in [Currency], ensuring receipt of not less than INR [●] equivalent, computed at prevailing exchange rate on the date of remittance.”
      4. Arbitration & Governing Law must switch automatically based on the rule.
      5. Style must be professional, legally sound, internationally acceptable.
    `;

    try {
      await APIService({
        question: fullPrompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse('Sorry, we couldn\'t generate a response. Please try again.');
          }
        }
      });
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Error fetching response. Please try again.');
      setLoading(false);
    }
  };

  // Define steps and their fields
  const steps = [
    {
      title: 'Company Details',
      fields: [
        { name: 'companyName', label: 'Company Name', type: 'text', required: true },
        { name: 'companyAddress', label: 'Company Registered Office Address', type: 'textarea', required: true },
        { name: 'companyCountry', label: 'Company Country', type: 'text', required: true }
      ]
    },
    {
      title: 'Consultant Details',
      fields: [
        { name: 'consultantName', label: 'Consultant Name', type: 'text', required: true },
        { name: 'consultantAddress', label: 'Consultant Address', type: 'textarea', required: true },
        { name: 'consultantCountry', label: 'Consultant Country', type: 'text', required: true }
      ]
    },
    {
      title: 'Agreement Details',
      fields: [
        { name: 'effectiveDate', label: 'Effective Date of Agreement', type: 'date', required: true },
        { name: 'duration', label: 'Duration / Term of Engagement', type: 'text', required: true },
        { name: 'scopeOfServices', label: 'Scope of Services (Nature of Advisory Work)', type: 'textarea', required: true }
      ]
    },
    {
      title: 'Financial Details',
      fields: [
        { name: 'currency', label: 'Currency', type: 'text', required: true },
        { name: 'minINRValue', label: 'Minimum Guaranteed INR Value', type: 'text', required: formData.currency !== 'INR', conditional: formData.currency !== 'INR' },
        { name: 'feeStructure', label: 'Fee / Remuneration Structure', type: 'textarea', required: true }
      ]
    },
    {
      title: 'Clauses',
      fields: [
        { name: 'terminationClause', label: 'Termination Clause', type: 'textarea', required: true },
        { name: 'confidentialityClause', label: 'Confidentiality Clause', type: 'select', options: ['standard', 'specific'], required: true }
      ]
    },
    {
      title: 'Board Resolution Details',
      fields: [
        { name: 'boardMeetingDate', label: 'Board Meeting Date', type: 'date', required: true },
        { name: 'resolutionNumber', label: 'Resolution Number (if any)', type: 'text', required: false },
        { name: 'resolutionExtract', label: 'Extract of Resolution (if provided)', type: 'textarea', required: false }
      ]
    }
  ];

  // Render form fields for the current step
  const renderStepFields = () => {
    const currentStepData = steps[currentStep - 1];
    return currentStepData.fields.map((field) => (
      field.conditional === undefined || field.conditional ? (
        <Form.Group key={field.name} className="mb-3 form-group">
          <Form.Label className="form-label">{field.label}</Form.Label>
          {field.type === 'textarea' ? (
            <Form.Control
              as="textarea"
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              required={field.required}
              placeholder={`Enter ${field.label}`}
              className="form-control"
              rows={3}
            />
          ) : field.type === 'select' ? (
            <Form.Select
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              required={field.required}
              className="form-select"
            >
              {field.options.map((option) => (
                <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
              ))}
            </Form.Select>
          ) : (
            <Form.Control
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              required={field.required}
              placeholder={`Enter ${field.label}`}
              className="form-control"
            />
          )}
          {field.name === 'currency' && formData.companyCountry && (
            <Form.Text className="text-muted">
              Default currency for {formData.companyCountry} is {currencyMap[formData.companyCountry] || 'USD'}.
            </Form.Text>
          )}
          {field.name === 'minINRValue' && (
            <Form.Text className="text-muted">
              To protect against exchange fluctuations.
            </Form.Text>
          )}
        </Form.Group>
      ) : null
    ));
  };

  // Check if the current step is valid
  const isStepValid = () => {
    const currentStepData = steps[currentStep - 1];
    return currentStepData.fields.every(field => 
      !field.required || (field.conditional !== undefined ? field.conditional && formData[field.name] : formData[field.name])
    );
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
    <Container fluid className="py-5 px-2" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <Card className="input-card">
            <Card.Body>
              <h2 className="card-title">Capital Raising Advisory Agreement</h2>
              {!isCompleted ? (
                <>
                  <div className="step-indicator mb-4">
                    Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                  </div>
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    if (currentStep === steps.length) {
                      handleComplete();
                    } else {
                      handleNext();
                    }
                  }}>
                    {renderStepFields()}
                    <div className="d-flex justify-content-between mt-3">
                      {currentStep > 1 && (
                        <Button variant="outline-primary" onClick={handlePrevious} className="btn btn-outline-primary">
                          <FaArrowLeft /> Previous
                        </Button>
                      )}
                      {currentStep < steps.length ? (
                        <Button variant="primary" type="submit" disabled={!isStepValid()} className="btn btn-primary ms-auto">
                          Next <FaArrowRight />
                        </Button>
                      ) : (
                        <Button variant="primary" type="submit" disabled={!isStepValid()} className="btn btn-primary ms-auto">
                          {loading ? (
                            <>
                              <FaSpinner className="spinner" /> Generating...
                            </>
                          ) : (
                            <>
                              Generate Agreement <FaCheck />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </Form>
                </>
              ) : (
                <div className="text-center p-4">
                  <h4>Agreement Generation in Progress</h4>
                  {loading ? (
                    <div className="mt-3">
                      <FaSpinner className="spinner" size={30} />
                      <p>Generating your agreement, please wait...</p>
                    </div>
                  ) : (
                    <p>Your agreement has been generated successfully!</p>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CapitalRaisingAdvisoryAgreement;
