import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const InsiderTradingPolicy = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Insider Trading Policy form data
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

    const prompt = `Draft an Insider Trading Policy for ${formData.companyName}, 
    a listed company, to regulate and govern the purchase, sale, and dealing of securities of the company 
    by its directors, employees, and other insiders. The policy should ensure compliance with the 
    Securities and Exchange Board of India (Prohibition of Insider Trading) Regulations, 2015, 
    and other applicable laws and regulations.

The policy should include only followings:

1) Legal Provision of Companies Act, 2013 and rules made thereunder.
2) Prohibition on Insider Trading: Prohibit insiders from trading in securities while in possession of unpublished price-sensitive information.
3) Code of Conduct: Outline the code of conduct for insiders, including trading restrictions, disclosure requirements, and consequences of non-compliance.
4) Trading Window: Specify the trading window for insiders, including the period during which trading is permitted or restricted.
5) Disclosure Requirements: Outline the disclosure requirements for insiders, including initial disclosures, continual disclosures, and disclosures of holdings.
6) Consequences of Non-Compliance: Specify the consequences of non-compliance with the policy, including disciplinary action and reporting to regulatory authorities.
7) Review and Update: Provide for periodic review and update of the policy to ensure compliance with changing regulatory requirements.\

Exclude any other details from the policy like definitions, purpose, effective date, etc.`;


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
            <h2 className="card-title">Insider Trading Policy Generator</h2>

            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Name *</Form.Label>
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
                    Generating Insider Trading Policy...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Insider Trading Policy
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
            <h2 className="card-title" style={{ marginBottom: '12px' }}>Insider Trading Policy</h2>
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
                      fileName: `${formData.companyName}-insider-trading-policy.pdf`,
                      title: `Insider Trading Policy`
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
                      fileName: `${formData.companyName}-insider-trading-policy.docx`,
                      title: `Insider Trading Policy`
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

export default InsiderTradingPolicy;
