import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';


const SecretarialAudit = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: 'Listed Company',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

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

    const prompt = `
Name of the company :- ${formData.companyName}
Type - Type of Companies required to undergo for secretarial audit: ${formData.companyType}

- Every listed company (as per SEBI 
- Every public company having a paid-up share capital of ₹50 crores or more 
- Every public company having a turnover of ₹250 crores or more 

Conduct a Secretarial Audit for a ${formData.companyType} under the following provisions:

1. Section 204 of the Companies Act, 2013, along with Rule 9 of the Companies (Appointment and Remuneration of Managerial Personnel) Rules, 2014
2. Regulation 24A of SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015

Output Requirements:

1. Legal Provision, Scope, and Purpose: Provide a brief overview of the legal provision, scope, and purpose of Secretarial Audit under the mentioned sections.
2. Practice and Procedure: Outline the practice and procedure for conducting Secretarial Audit.
3. Act-wise List of Documents, Report & Register Required for Audit: List the documents, reports, and registers required for Secretarial Audit under the Companies Act, 2013, and SEBI (LODR) Regulations, 2015.
4. Checklist for Secretarial Audit: Prepare a checklist for Secretarial Audit specific to the type of company, including key areas such as:
    - Incorporation documents
    - Board meetings and resolutions
    - Share capital and allotment
    - Directors and Key Managerial Personnel
    - Compliance with statutory registers
    - Filing of forms and returns
    - Other compliance requirements specific to the company type
5. Penal Provision for Non-Compliance: Describe the penal provisions for non-compliance with the Secretarial Audit requirements.
6. Draft Email: Draft an email intimating the commencement of Secretarial Audit in the fortnight and requesting the company to keep the required documents ready and available for audit. The email should include a list of documents required for audit.

Output Format:
The output should be in a clear and concise format, with headings and bullet points as necessary. The draft email should be in a standard business format.

Exclude any introductory notes, prefaces,end notes or disclaimers from the output.
`;

try {
    await APIService({
      question: prompt,
      onResponse: (data) => {
        setLoading(false);
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
          setResponse(data.candidates[0].content.parts[0].text);
          // console.log(data.candidates[0].content.parts[0].text);
        } else {
          setResponse("Sorry, we couldn't generate a compliance calendar. Please try again.");
        }
      }
    });
  } catch (error) {
    setLoading(false);
    setResponse("An error occurred while generating the compliance calendar. Please try again later.");
    console.error("Error:", error);
  }
  };

  // Company type options
  const companyTypes = [
    'Listed Company',
    'Public Company - more than 50 crores paid up share capital',
    'Public Company - more than 250 crores turnover'
  ];

  const RedStrong = ({ children }) => {
    // Apply Tailwind CSS class 'text-red-500' to make the text red
    return <strong style={{textDecoration: 'underline'}}>{children}</strong>;
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <h1 className="page-title">Secretarial Audit</h1>
          <p className="page-description" style={{marginBottom:'16px',textAlign:'center'}}>
          Provision - process - practice- checklist - intimation
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Type</Form.Label>
                <Form.Select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  {companyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Generating Audit Report...' : 'Generate Secretarial Audit Report'}
              </button>
            </Form>
          </Card>
        </Col>
      </Row>

      {loading && (
        <Row className="justify-content-center">
          <Col md={10}>
            <div className="loading-container">
              <FaSpinner style={{animation: 'spin 1s linear infinite', fontSize: '3rem', color: 'gray' }} />
            </div>
          </Col>
        </Row>
      )}

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            <h2 className="card-title" style={{marginBottom:'12px'}}> Checklist for Secretarial Audit - {formData.companyType}</h2>
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
                      fileName: `${formData.companyName}-secretarial-audit.pdf`,
                      title: `Checklist for Secretarial Audit`
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
                      fileName: `${formData.companyName}-secretarial-audit.docx`,
                      title: `Secretarial Audit Report`
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  <span className="d-none d-sm-inline">Download Word</span>
                </Button>
              </div>
              <div className="markdown-content">
                <ReactMarkdown
                 components={{
                  // Override the default 'strong' component with our custom 'RedStrong' component
                  strong: RedStrong,
                }}
                >{response}</ReactMarkdown>
              </div>
              <AIDisclaimer variant="light" />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SecretarialAudit;
