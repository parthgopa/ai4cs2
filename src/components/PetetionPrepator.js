import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaGavel } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const PetitionPreparator = () => {
  const [formData, setFormData] = useState({
    petitionerName: '',
    respondentName: '',
    jurisdiction: 'NCLT',
    reliefSought: '',
    backgroundFacts: '',
    grounds: '',
    sectionsInvoked: ''
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

    const prompt = `Generate a formal legal petition based on the following inputs:
- Petitioner Name: ${formData.petitionerName}
- Respondent Name: ${formData.respondentName}
- Jurisdiction: ${formData.jurisdiction}
- Relief Sought: ${formData.reliefSought}
- Background Facts: ${formData.backgroundFacts}
- Grounds: ${formData.grounds}
- Sections Invoked: ${formData.sectionsInvoked}

Structure the output with proper legal formatting, clear section headings, and maintain professional tone. Include title, parties, jurisdiction, facts, legal grounds, prayer for relief, and verification.`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the petition. Please try again.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the petition. Please try again later.");
      console.error("Error:", error);
    }
  };

  const RedStrong = ({ children }) => {
    return <strong style={{ textDecoration: 'underline' }}>{children}</strong>;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Petition Preparator</h2>
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Petitioner Name</Form.Label>
                <Form.Control
                  type="text"
                  name="petitionerName"
                  value={formData.petitionerName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Respondent Name</Form.Label>
                <Form.Control
                  type="text"
                  name="respondentName"
                  value={formData.respondentName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Jurisdiction</Form.Label>
                <Form.Select
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="NCLT">NCLT</option>
                  <option value="ROC">ROC</option>
                  <option value="SEBI">SEBI</option>
                  <option value="High Court">High Court</option>
                  <option value="Supreme Court">Supreme Court</option>
                  <option value="District Court">District Court</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Relief Sought</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="reliefSought"
                  value={formData.reliefSought}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Background Facts</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="backgroundFacts"
                  value={formData.backgroundFacts}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Grounds</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="grounds"
                  value={formData.grounds}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Sections Invoked</Form.Label>
                <Form.Control
                  type="text"
                  name="sectionsInvoked"
                  value={formData.sectionsInvoked}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., Section 241, 242 of Companies Act 2013"
                  required
                />
              </Form.Group>

              <button type="submit" className="features-button" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Petition...
                  </>
                ) : (
                  <>
                    <FaGavel className="me-2" />
                    Generate Petition
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
            <h1 className="card-title" style={{ marginBottom: '6px' }}>{formData.petitionerName} vs {formData.respondentName}</h1>
            <h2 className="card-title" style={{ marginBottom: '12px' }}>Legal Petition</h2>
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
                      fileName: `${formData.petitionerName}-vs-${formData.respondentName}-petition.pdf`,
                      title: `Legal Petition`
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
                      fileName: `${formData.petitionerName}-vs-${formData.respondentName}-petition.docx`,
                      title: `Legal Petition`
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
                  remarkPlugins={[remarkGfm]}
                  components={{
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

export default PetitionPreparator;