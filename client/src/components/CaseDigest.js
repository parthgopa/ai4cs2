import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch, FaGavel } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const CaseDigest = () => {
  const [formData, setFormData] = useState({
    caseInput: '',
    reliefInput: 'No',
    lawFilter: 'Companies Act'
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Law filter options
  const lawFilters = [
    'Companies Act',
    'SEBI Regulations',
    'Insolvency & Bankruptcy Code',
    'Contract Law',
    'Tax Law',
    'Labour Law',
    'FEMA',
    'Competition Law',
    'Securities Law',
    'Corporate Governance'
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

    const prompt = `You are "CaseDigest" — a professional Corporate Case Law Summarizer for Company Secretaries, lawyers and compliance officers. Produce concise, precedent-driven digests focused on corporate/commercial law (Companies Act, SEBI, Insolvency, Contract, Tax). 

USER INPUT: 
- CASE_INPUT: ${formData.caseInput}
- RELIEF_INPUT: ${formData.reliefInput}
- LAW_FILTER: ${formData.lawFilter}

INSTRUCTIONS: 
1) If CASE_INPUT looks like a citation, verify it and fetch authoritative sources (tribunal/HC/SC PDF, SCConline, indiankanoon, official registers). If it's a plain situation, search for the most relevant cases under ${formData.lawFilter}. 

2) Output the digest with these sections exactly and in this order: 

- **Title** (Case or Situation; include Court + Year if available) 
- **Sources** (up to 3 verified URLs) 
- **Facts** (3–6 lines) 
- **Issues** (2–4 numbered items) 
- **Bare Act Text** (quote relevant section(s); if amended show Old vs New) 
- **Precedents**: for each case give: Case Name | Citation | Court | Year | One-line ratio. Include 2–3 HC/NCLAT/NCLT cases and 1–2 SC cases where relevant. If citation was provided, verify and expand. 
  * Highlight the "Most Recent Case" separately (full details). 
  * If conflicting views exist, note comparative positions. 
- **Relief Trends** (1–2 lines) — what remedies courts typically grant (connect to RELIEF_INPUT if provided). 
- **Judicial Reasoning** (4–6 sentences) — how courts apply law to facts. 
- **Compliance Checklist** (3–5 actionable bullets for practitioners). 
- **Cross References** (relevant sections, rules, and optionally point to Knowledge shortcut). 
- **Confidence Level**: High / Medium / Low (based on availability of reported authoritative precedents). 
- **Quick Example** (1 line). 

3) If no reported cases are found, state exactly: "No reported judgments available." Do not hallucinate citations—mark any unverified fact as *unverified*. 

4) Always include Citation + Court + Year for each precedent. If you quote act text, keep wording exact and short (≤ 60 words per quoted extract). If an amendment exists, label Old vs New and give amendment date. 

5) Tone: professional, neutral, concise.`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the case digest. Please try again with different search terms.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the case digest. Please try again later.");
      console.error("Error:", error);
    }
  };

  const RedStrong = ({ children }) => {
    return <strong style={{ textDecoration: 'underline' }}>{children}</strong>;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
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
              <h1 className="page-title mb-0">Case Digest</h1>
              <p className="page-description text-muted mb-0">
                Generate comprehensive case law summaries with precedent analysis
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Case Law Analysis</h2>
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Case Input</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="caseInput"
                  value={formData.caseInput}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter case citation (e.g., 'ABC Ltd v. XYZ Corp (2023) 4 SCC 123') OR describe a legal situation"
                  required
                />
                <Form.Text className="text-muted">
                  You can enter a specific case citation or describe a legal scenario for case law research.
                </Form.Text>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Law Filter</Form.Label>
                <Form.Select
                  name="lawFilter"
                  value={formData.lawFilter}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  {lawFilters.map((filter) => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Select the primary area of law to focus the case digest analysis.
                </Form.Text>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Relief Sought</Form.Label>
                <Form.Control
                  type="text"
                  name="reliefInput"
                  value={formData.reliefInput}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter specific relief sought or type 'No' if not applicable"
                />
                <Form.Text className="text-muted">
                  Specify the type of relief or remedy being sought (optional).
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
                    Analyzing Case Law...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Case Digest
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
                      fileName: `case-digest-${formData.lawFilter.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`,
                      title: `Case Digest - ${formData.lawFilter}`
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
                      fileName: `case-digest-${formData.lawFilter.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.docx`,
                      title: `Case Digest - ${formData.lawFilter}`
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

export default CaseDigest;
