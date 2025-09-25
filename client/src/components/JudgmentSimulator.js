import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch, FaGavel } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const JudgmentSimulator = () => {
  const [formData, setFormData] = useState({
    caseDetails: '',
    lawSection: '',
    reliefRequested: '',
    knownPrecedents: ''
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

    const prompt = `You are 'SimuLaw' — a concise, professional Legal Judgment Simulation assistant for corporate/commercial law (Companies Act, SEBI, Insolvency, Contracts). Focused on Company Secretaries, lawyers and compliance professionals.

USER INPUT:
- CASE: ${formData.caseDetails}
- LAW: ${formData.lawSection}
- RELIEF: ${formData.reliefRequested || 'Not specified'}
- PRECEDENTS: ${formData.knownPrecedents || 'None provided'}

INSTRUCTIONS:
1) Frame legal issues as a numbered list (2-6 items).

2) Identify law/section: if specific section provided, quote the Bare Act text (show Old vs New if amended). If only Act/concept, list likely sections and pick the most relevant, mark ambiguity if any.

3) Precedents: if user provided, verify and list each with Case Name | Citation | Court | Year | one-line ratio. If none, fetch 2-3 relevant High Court/NCLAT/NCLT cases and 1-2 Supreme Court cases; highlight the Most Recent Case.

4) Arguments: for each issue, give Petitioner/Claimant arguments (2-4 bullets) and Respondent/Defense arguments (2-4 bullets) with supporting citations.

5) Judicial Analysis: apply precedents issue-wise to the facts (2-4 sentences per issue); note factual gaps that affect outcome.

6) Simulated Judgment: state outcome per issue, give orders/remedies and 3 practical Compliance Notes for professionals.

7) Output must use these headings exactly: 
   - Issues
   - Bare Act Text
   - Precedents
   - Arguments
   - Judicial Analysis
   - Final Judgment
   - Compliance Notes
   - Short Summary

RULES: 
- Output only in English
- Always include citation + Court + Year
- If no reported judgments found, state: "No reported judgments available"
- Tone: professional, judicial, concise
- Remove any introductory paragraph and end notes.`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the judgment simulation. Please try again with different inputs.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the judgment simulation. Please try again later.");
      console.error("Error:", error);
    }
  };

  const RedStrong = ({ children }) => {
    return <strong style={{ textDecoration: 'underline' }}>{children}</strong>;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <div className="page-header d-flex align-items-center mb-4">
            <FaGavel className="me-3" style={{ fontSize: '2rem', color: '#0d6efd' }} />
            <div>
              <h1 className="page-title mb-0">Judgment Simulator</h1>
              <p className="page-description text-muted mb-0">
                Simulate legal judgments with comprehensive case analysis and precedent application
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Legal Judgment Simulation</h2>
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Case Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="caseDetails"
                  value={formData.caseDetails}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Describe briefly — parties, dispute, and key facts (dates, amounts, events). Example: 'Company X granted ₹50 lakh loan to its Director without SR; ROC issued show-cause notice.'"
                  required
                />
                <Form.Text className="text-muted">
                  Provide clear details about the parties involved, nature of dispute, and key factual elements.
                </Form.Text>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Applicable Law / Section</Form.Label>
                <Form.Control
                  type="text"
                  name="lawSection"
                  value={formData.lawSection}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 'Section 185, Companies Act 2013' or 'Loan to Director' or 'Companies Act 2013'"
                  required
                />
                <Form.Text className="text-muted">
                  If exact section known, write it. If not, write Act name or legal concept.
                </Form.Text>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Relief Requested (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="reliefRequested"
                  value={formData.reliefRequested}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 'quash penalty', 'validate transaction', 'compliance direction'"
                />
                <Form.Text className="text-muted">
                  State the specific relief or remedy being sought in the case.
                </Form.Text>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Known Precedents (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="knownPrecedents"
                  value={formData.knownPrecedents}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="If known, provide case name/citation. Example: 'HP Enterprise India Pvt. Ltd. v. ROC Karnataka, (2018) 146 CompCas 258 (NCLAT)'"
                />
                <Form.Text className="text-muted">
                  Provide any relevant case citations or precedents you're aware of.
                </Form.Text>
              </Form.Group>

              <Button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Simulating Judgment...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Judgment Simulation
                  </>
                )}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="output-card">
              <div className="d-flex justify-content-end mb-3">
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                    alert('Copied to clipboard!');
                  }}
                >
                  <FaCopy className="me-1" />
                  Copy
                </Button>
                <Button
                  variant="outline-danger"
                  className="me-2"
                  onClick={() => {
                    const { generatePDF } = PDFGenerator({
                      content: response,
                      fileName: `judgment-simulation-${new Date().toISOString().split('T')[0]}.pdf`,
                      title: `Judgment Simulation - ${formData.lawSection}`
                    });
                    generatePDF();
                  }}
                >
                  <FaFilePdf className="me-1" />
                  PDF
                </Button>
                <Button
                  variant="outline-success"
                  onClick={() => {
                    const { generateWord } = WordGenerator({
                      content: response,
                      fileName: `judgment-simulation-${new Date().toISOString().split('T')[0]}.docx`,
                      title: `Judgment Simulation - ${formData.lawSection}`
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  Word
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

export default JudgmentSimulator;
