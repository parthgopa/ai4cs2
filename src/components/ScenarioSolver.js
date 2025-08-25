import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const ScenarioSolver = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Document Management Policy form data
  const [formData, setFormData] = useState({
    scenario: '',
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

    const prompt = `You are a qualified Company Secretary with expertise in Indian corporate laws. 
    Analyze the following corporate legal scenario and provide a clear, structured response in steps in note form:

1. Identify the applicable provisions from the Companies Act, 2013 or other relevant laws.

2. Outline the procedural steps that should be taken by the company.

3. Mention forms, filings, timelines, and responsible parties ( in dot point form).

4. Highlight any exceptions or important notes.

5. Citation of latest case Laws pertaining to this issue - (high Court ,NCLT , Supreme Court).

6. If applicable, cite relevant case laws or precedents.

Here is the scenario:
${formData.scenario}
    
Exclude other details from the policy like definitions, purpose, effective date,scope,disclaimers etc.`;

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
            <h2 className="card-title">Scenario Solver</h2>

            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label"> Describe the Scenario for which you need a solution</Form.Label>
                {/* The input should be a textarea */}
                <Form.Control
                  as="textarea"
                  rows={10}
                  name="scenario"
                  value={formData.scenario}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <button type="submit" className="features-button" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Scenario Solver...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Scenario Solver
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
            <h1 className="card-title" style={{ marginBottom: '6px' }}>Scenario Solver</h1>
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
                      fileName: `scenario-solver.pdf`,
                      title: `Scenario Solver`
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
                      fileName: `scenario-solver.docx`,
                      title: `Scenario Solver`
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

export default ScenarioSolver;
