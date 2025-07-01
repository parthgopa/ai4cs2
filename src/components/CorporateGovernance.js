import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const CorporateGovernance = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: 'Private Limited Company',
    industry: '',
    revenue: '',
    marketCap: '',
    boardSize: '',
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
Generate a comprehensive corporate governance report for ${formData.companyName}, 
a ${formData.companyType} operating in the ${formData.industry} with an annual revenue of 
${formData.revenue} and market capitalization of ${formData.marketCap}. 
The company has a board of ${formData.boardSize} directors. 
Analyze the company's board composition, governance practices, and regulatory compliance, focusing on areas such as board diversity, executive compensation, and risk management. 
Identify potential gaps or inconsistencies and provide recommendations for improvement to enhance corporate governance and mitigate risks.

Exclude any introductory notes, prefaces, end note or disclaimers from the output.

Date format -DD/MM/YYYY

Output in the form of dot points note with name of company and in legal tone.
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
      setResponse("An error occurred while generating the corporate governance report. Please try again later.");
      console.error("Error:", error);
    }
  };

  const companyTypes = [
    { value: 'Private Limited Company', label: 'Private Limited Company' },
    { value: 'Unlisted Public Limited', label: 'Unlisted Public Limited' },
    { value: 'Listed Public Limited', label: 'Listed Public Limited' },
  ];

  const industryOptions = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Telecommunications', label: 'Telecommunications' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Corporate Governance Report Generator</h2>
            <Form onSubmit={handleSubmit}>
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

              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Type</Form.Label>
                <Form.Select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  {companyTypes.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Industry/Sector</Form.Label>
                <Form.Select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Industry</option>
                  {industryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Annual Revenue</Form.Label>
                <Form.Control
                  type="text"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 10 million"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Market Capitalization</Form.Label>
                <Form.Control
                  type="text"
                  name="marketCap"
                  value={formData.marketCap}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 50 million"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Number of Board Directors</Form.Label>
                <Form.Control
                  type="number"
                  name="boardSize"
                  value={formData.boardSize}
                  onChange={handleInputChange}
                  className="form-control"
                  min="1"
                  required
                />
              </Form.Group>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Generating Report...' : 'Generate Governance Report'}
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
            <h1 className="card-title" style={{marginBottom:'6px'}}> {formData.companyName} -</h1>
            <h2 className="card-title" style={{marginBottom:'12px'}}>Corporate Governance Report</h2>
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
                      fileName: `${formData.companyName}-corporate-governance-report.pdf` 
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
                      fileName: `${formData.companyName}-corporate-governance-report.docx` 
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

export default CorporateGovernance;
