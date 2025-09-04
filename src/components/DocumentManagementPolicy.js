import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const DocumentManagementPolicy = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Document Management Policy form data
  const [formData, setFormData] = useState({
    companyName: '',
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

    const prompt = `Draft a Document Management Policy for ${formData.companyName} that outlines procedures 
    for managing documents related to secretarial functionality, including board meeting minutes, 
    general meeting minutes, annual returns, shareholding disclosures, statutory registers, forms, 
    and other documents required to be maintained under the Companies Act, 2013, 
    and SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015. 
    The policy should ensure compliance with applicable laws and regulations in note form, including:

    1) Legal Provision of Companies Act, 2013 and rules made thereunder.
    2) Retention Periods: Specify retention periods as per the Companies Act, 2013, and SEBI regulations, such as:
    - Permanent Retention: Documents like minute books, statutory registers, and certificates of incorporation.
    - Eight Years Retention: Documents like notices, agendas, and annual financial statements.
    3) Storage and Access: Outline procedures for storing and accessing documents, including:
    - Physical Storage: Secure rooms or cabinets.
    - Digital Storage: Secure servers or cloud storage with access controls.
    4) Compliance Requirements: Refer to relevant provisions of the Companies Act, 2013, and SEBI regulations, such as:
    - Section 204 of the Companies Act, 2013: Secretarial audit requirements.
    - Regulation 24A of SEBI (LODR) Regulations, 2015: Secretarial audit report requirements.
    - Regulation 9 of SEBI (LODR) Regulations, 2015: Policy for preservation of documents.
    5) Rule as to disposal of old documents.
    
    Exclude other details from the policy like definitions, purpose, effective date,scope etc.`;

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
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Document Management Policy</h2>

            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <button type="submit" className="features-button" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Document Management Policy...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Document Management Policy
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
            <h1 className="card-title" style={{ marginBottom: '6px' }}>{formData.companyName} -</h1>
            <h2 className="card-title" style={{ marginBottom: '12px' }}>Document Management Policy</h2>
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
                      fileName: `${formData.companyName}-document-management-policy.pdf`,
                      title: `Document Management Policy`
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
                      fileName: `${formData.companyName}-document-management-policy.docx`,
                      title: `Document Management Policy`
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

export default DocumentManagementPolicy;
