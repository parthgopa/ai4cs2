import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const AgreementDrafting = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Agreement types list
  const agreementTypes = [
    'Partnership Agreement',
    'Joint Venture Agreement',
    'Memorandum of Understanding (MOU)',
    'Service Level Agreement (SLA)',
    'Employment Contract',
    'Non-Compete Agreement',
    'Non-Disclosure Agreement (NDA)',
    'Loan Agreement',
    'Promissory Note',
    'Guarantee Agreement',
    'License Agreement',
    'Copyright Agreement',
    'Trademark License Agreement',
    'Rental Agreement',
    'Lease Agreement',
    'Purchase Agreement',
    'Supply Agreement',
    'Procurement Contract',
    'Software License Agreement',
    'Software Development Agreement',
    'Data Processing Agreement',
    'Confidentiality Agreement',
    'Settlement Agreement',
    'Collaboration Agreement'
  ];

  // Agreement Drafting form data
  const [formData, setFormData] = useState({
    agreementType: '',
    partyAName: '',
    partyAAddress: '',
    partyBName: '',
    partyBAddress: '',
    duration: '',
    startDate: '',
    endDate: '',
    briefDescription: '',
    partyAObligations: '',
    partyBObligations: '',
    paymentSchedule: '',
    paymentAmount: '',
    terminationConditions: '',
    noticePeriod: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    const prompt = `Generate a ${formData.agreementType} agreement between ${formData.partyAName} with address ${formData.partyAAddress} and ${formData.partyBName} with address ${formData.partyBAddress}.

Term:
The agreement shall commence on ${formData.startDate} and shall continue for ${formData.duration} or until ${formData.endDate}.

Purpose:
The purpose of this agreement is to ${formData.briefDescription}.

Obligations:

- Party A shall be responsible for: ${formData.partyAObligations}
- Party B shall be responsible for: ${formData.partyBObligations}

Payment Terms:

- Payment Schedule: ${formData.paymentSchedule} (e.g., monthly, quarterly)
- Payment Amount: ${formData.paymentAmount}

Termination:

- Conditions for termination: ${formData.terminationConditions}
- Notice Period: ${formData.noticePeriod}

Please generate a comprehensive ${formData.agreementType} agreement incorporating the above details, including all necessary clauses and provisions.`;

    try {
      await APIService({
        question: prompt,
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
      setLoading(false);
      setResponse('An error occurred while processing your request. Please try again.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'textarea') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Agreement Drafting</h2>

            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              {/* Agreement Type */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Agreement Type *</Form.Label>
                <Form.Select
                  name="agreementType"
                  value={formData.agreementType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Agreement Type</option>
                  {agreementTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Party A Details */}
              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Party A Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="partyAName"
                      value={formData.partyAName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Party A Address *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="partyAAddress"
                      value={formData.partyAAddress}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Party B Details */}
              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Party B Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="partyBName"
                      value={formData.partyBName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Party B Address *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="partyBAddress"
                      value={formData.partyBAddress}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Term Details */}
              <Row>
                <Col md={4}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Duration *</Form.Label>
                    <Form.Control
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g., 2 years, 6 months"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Start Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Purpose */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Purpose - Brief Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="briefDescription"
                  value={formData.briefDescription}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Describe the purpose of this agreement"
                  required
                />
              </Form.Group>

              {/* Obligations */}
              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Party A Obligations *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="partyAObligations"
                      value={formData.partyAObligations}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Specify Party A's responsibilities"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Party B Obligations *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="partyBObligations"
                      value={formData.partyBObligations}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Specify Party B's responsibilities"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Payment Terms */}
              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Payment Schedule *</Form.Label>
                    <Form.Control
                      type="text"
                      name="paymentSchedule"
                      value={formData.paymentSchedule}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g., monthly, quarterly, annually"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Payment Amount *</Form.Label>
                    <Form.Control
                      type="text"
                      name="paymentAmount"
                      value={formData.paymentAmount}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g., $10,000, ₹50,000"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Termination */}
              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Termination Conditions *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="terminationConditions"
                      value={formData.terminationConditions}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Specify conditions for termination"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Notice Period *</Form.Label>
                    <Form.Control
                      type="text"
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g., 30 days, 3 months"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Agreement...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Agreement
                  </>
                )}
              </button>
            </Form>
          </Card>
        </Col>
      </Row>

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            <h1 className="card-title" style={{ marginBottom: '6px' }}>{formData.agreementType}</h1>
            <h2 className="card-title" style={{ marginBottom: '12px' }}>Between {formData.partyAName} and {formData.partyBName}</h2>
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
                      fileName: `${formData.agreementType.replace(/\s+/g, '-').toLowerCase()}-${formData.partyAName}-${formData.partyBName}.pdf`,
                      title: `${formData.agreementType}`
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
                      fileName: `${formData.agreementType.replace(/\s+/g, '-').toLowerCase()}-${formData.partyAName}-${formData.partyBName}.docx`,
                      title: `${formData.agreementType}`
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  <span className="d-none d-sm-inline">Download Word</span>
                </Button>
              </div>
              <div className="markdown-content">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
              <AIDisclaimer variant="light" />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AgreementDrafting;
