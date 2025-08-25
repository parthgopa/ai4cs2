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
  const [templateLoading, setTemplateLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [currentfeature, setCurrentfeature] = useState('');

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
    dateOfAgreement: '',
    partyAName: '',
    partyADescription: '',
    partyAAddress: '',
    partyBName: '',
    partyBDescription: '',
    partyBAddress: '',
    purpose: '',
    effectiveDate: '',
    duration: '',
    governingLaw: 'Andhra Pradesh',
    specialClauses: '',
    signatureNames: '',

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    setTemplateLoading(true);
    setResponse('');
    setCurrentfeature('agreement-template');

    const prompt = `Generate a Professional Template for a "${formData.agreementType}" Agreement (Template Only)

Prepare a dummy draft of a "${formData.agreementType}" agreement in a highly professional format, as would be prepared by a senior and experienced solicitor practicing under Indian laws. This template is for structural preview only and should include:

A formal and sophisticated legal drafting style

Compliance with Indian laws and best practices for such agreement types

Clearly structured clauses, definitions, schedules (if any), and annexures

Use of formal legal phrases and terminology suitable for High Court or Tribunal presentation

Placeholder text for all variable elements (e.g., [Party Name], [Date], [Consideration Amount], [Governing Law], etc.)

The title of the agreement should be: "${formData.agreementType} Agreement (Template)"

Use a consistent format with numbered clauses, section headings, and indented sub-clauses.

Ensure the template maintains clarity, authority, and readability, reflecting the standard expected from top-tier legal firms in India.


⚖ This template should not contain actual party-specific information, but be ready for such data to be inserted.
🖋 The style should reflect that of a learned senior solicitor of over 20 years' experience in corporate law practice.
 `;

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
      setTemplateLoading(false);
      setResponse('An error occurred while processing your request. Please try again.');
    }
    setTemplateLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentfeature('agreement-drafting');
    setResponse('');

    const prompt = `Generate a legally binding "${formData.agreementType}" agreement under Indian laws.
Based on the provided input variables, prepare a complete and professionally drafted agreement as would be prepared by a senior solicitor with over 20 years of corporate law experience.
Follow the style, structure, and terminology used in Indian legal practice, ensuring compliance with applicable laws (such as the Indian Contract Act, Companies Act, etc.).
The document must include:
•	A formal title (e.g., “Shareholders Agreement”)
•	Date of execution
•	Parties’ legal identity and addresses
•	Recitals / Background
•	Detailed clauses covering rights, duties, obligations, representations, indemnity, termination, and dispute resolution
•	Jurisdiction and governing law (India)
•	Placeholders only where input is missing
•	Use numbered headings, sub-clauses, and professional formatting
⚖️ Ensure tone and language match that of documents submitted before Indian regulators, High Courts, or arbitral tribunals.

Agreement Type: ${formData.agreementType}
Date of Agreement: ${formData.dateOfAgreement}
Party A Name: ${formData.partyAName}
Party A Description: ${formData.partyADescription}
Party A Address: ${formData.partyAAddress}
Party B Name: ${formData.partyBName}
Party B Description: ${formData.partyBDescription}
Party B Address: ${formData.partyBAddress}
Purpose: ${formData.purpose}
Effective Date: ${formData.effectiveDate}
Duration: ${formData.duration}
Governing Law: ${formData.governingLaw}
Special Clauses: ${formData.specialClauses}
Signature Names: ${formData.signatureNames}`;

console.log(prompt);

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

  const indianRegions = [
    // States
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal","NCLT","Arbitration",
  
    // Union Territories
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];
  

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Agreement Drafting</h2>

            <Form>
              {/* Agreement Type */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Agreement Type </Form.Label>
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

              {/* Date of Agreement */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Date of Agreement </Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfAgreement"
                  value={formData.dateOfAgreement}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              {/* Party A Details */}
              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">First Party Name </Form.Label>
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
                    <Form.Label className="form-label">First Party Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="partyADescription"
                      value={formData.partyADescription}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">First Party Address </Form.Label>
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
                    <Form.Label className="form-label">Second Party Name </Form.Label>
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
                    <Form.Label className="form-label">Second Party Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="partyBDescription"
                      value={formData.partyBDescription}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Second Party Address </Form.Label>
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
                    <Form.Label className="form-label">Term / Duration</Form.Label>
                    <Form.Control
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g., 3 years from Effective Date"
                      required
                    />
                  </Form.Group>
                </Col>
                
              </Row>
              {/* Purpose */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Purpose of Agreement</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Describe the purpose of this agreement"
                  required
                />
              </Form.Group>

              {/* Effective Date */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Effective Date</Form.Label>
                <Form.Control
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              {/* Governing Law & Jurisdiction -dropdown of indian states*/}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Governing Law & Jurisdiction</Form.Label>
                <Form.Select
                  name="governingLaw"
                  value={formData.governingLaw}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  {indianRegions.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Special Clauses */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Special Clauses</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="specialClauses"
                  value={formData.specialClauses}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="IP rights, Exclusivity, Non-compete"
                />
              </Form.Group>

              {/* Signature Names & Designations */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Signature Names & Designations</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="signatureNames"
                  value={formData.signatureNames}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Name, title/designation for each party"
                />
              </Form.Group>

              <button onClick={handleSubmit} className="features-button" disabled={loading}>
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

              <button onClick={handleTemplateSubmit} className="features-button ms-2" disabled={loading}>
                {templateLoading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Template...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Template
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
            {currentfeature === 'agreement-template' && (
              <h2 className="card-title" style={{ marginBottom: '20px' }}>{formData.agreementType} Agreement Template</h2>
            )}
            {currentfeature === 'agreement-drafting' && (
              <h2 className="card-title" style={{ marginBottom: '20px' }}>{formData.agreementType} Agreement Draft</h2>
            )}
            {/* <h2 className="card-title" style={{ marginBottom: '12px' }}>Between {formData.partyAName} and {formData.partyBName}</h2> */}
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
