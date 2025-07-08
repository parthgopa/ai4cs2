import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const StatutoryRegisters = () => {
  const [formData, setFormData] = useState({
    companyType: 'Private Limited Company',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const companyTypes = [
    { value: 'Private Limited Company', label: 'Private Limited Company' },
    { value: 'Listed Public Limited Company', label: 'Listed Public Limited Company' },
    { value: 'Investment Company', label: 'Investment Company' },
    { value: 'Government Company', label: 'Government Company' },
    { value: 'Foreign Company', label: 'Foreign Company' },
  ];

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

    const prompt = `List out statutory registers and records maintain bye following ${formData.companyType} under different provisions of Companies 2013
With detail of applicable sections and provision for non compliance.
Do not generate any introductory notes, prefaces, end note or any kind of disclaimers in the output, as not required legally.`;

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
      console.error('Error fetching data:', error);
      setResponse('Error: Unable to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <h1 className="page-title">Statutory Registers and Records</h1>
          <p className="page-description">
            Get a comprehensive list of statutory registers and records that must be maintained under the Companies Act 2013 based on company type.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Type of Company</Form.Label>
                <Form.Select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  {companyTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Generating List...' : 'Generate Statutory Registers List'}
              </Button>
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
            <h2 className="card-title" style={{marginBottom:'12px'}}>Statutory Registers for {formData.companyType}</h2>
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
                      fileName: `statutory-registers-${formData.companyType}.pdf` 
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
                      fileName: `statutory-registers-${formData.companyType}.docx` 
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
                <p className="text-center mt-4"><strong>This report is generated by AI</strong></p>
              </div>
              <AIDisclaimer variant="light" />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default StatutoryRegisters;
