import React, { useState } from 'react';
import { Card, Form, Container, Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaBalanceScale, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const LegalOpinion = () => {
  const [formData, setFormData] = useState({
    legalQuery: '',
    outputFormat: 'Legal View Point',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Output format options
  const outputFormats = [
    'Legal View Point',
    'Board Note with Recommendations',
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

    const prompt = `
You are a senior legal expert specialized in Indian Company Law under the Companies Act, 2013.

A user has submitted the following legal query and selected a preferred output format. Based on this, draft a complete legal opinion, beginning with a professional heading, followed by a standard opening paragraph, format-specific structured content, and ending with a disclaimer that limits the liability of the Company Secretary or Legal Advisor issuing the opinion.

---

🔹 Legal Query:
${formData.legalQuery}

🔹 Output Format:
${formData.outputFormat}

--- 

🔷 Structure of the opinion:

1. *Heading:*
   ${formData.outputFormat} under the Companies Act, 2013

2. *Opening Paragraph (standard):*
   This ${formData.outputFormat} is issued pursuant to the request received regarding the applicability and interpretation of the relevant provisions under the Companies Act, 2013. The view point is based on the facts, assumptions, and legal context as understood from the query set out hereinbelow. It aims to provide a reasoned view based on applicable law, judicial precedents, and regulatory guidelines in force as of the date of this view point.

---

3. *Main Body – Format-Specific Instructions:*

🔸 If the output format is *Legal View Point*, then:
- Include:
  - Legal query summary
  - Key applicable sections and rules
  - 1–2 relevant case laws or MCA circulars
  - Final view point (yes/no/conditional with brief reasoning)
  - Risk classification
  - Optional bullet points for suggested actions
- Tone: Crisp, practical, and internal-advisory friendly

🔸 If the output format is *Board Note with Recommendations*, then:
- Include:
  1. Title and purpose of the note
  2. Background of the proposal
  3. Legal framework
  4. Business implications and risks
  5. Management recommendation
  6. Fully drafted board resolution
- Tone: Decision-ready, clear, board-oriented

Now at the end of every output, add a below disclaimer :

Disclaimer:

This ${formData.outputFormat} is prepared based on the facts and legal position provided or understood as of the date of issuance. It is intended solely for internal use by the requesting party for advisory purposes.

While due care has been taken in analyzing the provisions of the Companies Act, 2013 and applicable legal sources, this ${formData.outputFormat} does not constitute a binding legal position nor substitute formal legal representation or adjudication.

No liability shall arise on the part of the author or advisor for reliance placed on this ${formData.outputFormat}, especially where facts are misstated, incomplete, or have changed. Independent legal advice is recommended for high-risk or transaction-specific decisions.

This view point is issued in good faith and without prejudice to any legal rights or remedies.

Note:
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

  const RedStrong = ({ children }) => {
    // Apply Tailwind CSS class 'text-red-500' to make the text red
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
            <FaBalanceScale className="me-3" style={{ fontSize: '2rem', color: '#0d6efd' }} />
            <div>
              <h1 className="page-title mb-0">Legal View Point</h1>
              <p className="page-description text-muted mb-0">
                Generate expert legal opinions on company law matters with customizable formats
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Legal Query</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="legalQuery"
                  value={formData.legalQuery}
                  onChange={handleInputChange}
                  placeholder="Enter your legal query related to the Companies Act, 2013..."
                  required
                  className="form-control"
                />
                <Form.Text className="text-muted">
                  Provide detailed context for a more accurate legal opinion.
                </Form.Text>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Output Format</Form.Label>
                <Form.Select
                  name="outputFormat"
                  value={formData.outputFormat}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  {outputFormats.map((format) => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Select the format that best suits your needs:
                  <ul className="mt-2 small">
                    <li><strong>Concise Opinion Note:</strong> Brief, practical advice with key points</li>
                    <li><strong>Detailed Compliance Memo:</strong> Comprehensive analysis with full legal citations</li>
                    <li><strong>Board Note:</strong> Decision-ready document with draft resolution</li>
                    <li><strong>Executive Summary:</strong> Dashboard-style overview with risk assessment</li>
                  </ul>
                </Form.Text>
              </Form.Group>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Researching...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Conduct Legal Opinion
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
            <Card className="output-card">
              <div className="d-flex justify-content-end mb-3">
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                    alert('Copied to clipboard!');
                  }}
                >
                  <FaCopy className="me-1" />
                  Copy
                </button>
                <button
                  className="btn btn-outline-danger me-2"
                  onClick={() => {
                    const { generatePDF } = PDFGenerator({
                      content: response,
                      fileName: `legal-opinion-${new Date().toISOString().split('T')[0]}.pdf`,
                      title: `Legal Opinion - ${formData.outputFormat}`
                    });
                    generatePDF();
                  }}
                >
                  <FaFilePdf className="me-1" />
                  PDF
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => {
                    const { generateWord } = WordGenerator({
                      content: response,
                      fileName: `legal-opinion-${new Date().toISOString().split('T')[0]}.docx`,
                      title: `Legal Opinion - ${formData.outputFormat}`
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  Word
                </button>
              </div>
              <div className="markdown-content legal-opinion-content">
                <ReactMarkdown
                  components={{
                    strong: RedStrong,
                  }}
                >{response}</ReactMarkdown>
                <div>
                  Disclaimer:
                  This {formData.outputFormat} is prepared based on the facts and legal position provided or understood as of the date of issuance. It is intended solely for internal use by the requesting party for advisory purposes.
                  While due care has been taken in analyzing the provisions of the Companies Act, 2013 and applicable legal sources, this {formData.outputFormat} does not constitute a binding legal position nor substitute formal legal representation or adjudication.
                  No liability shall arise on the part of the author or advisor for reliance placed on this {formData.outputFormat}, especially where facts are misstated, incomplete, or have changed. Independent legal advice is recommended for high-risk or transaction-specific decisions.
                  This view point is issued in good faith and without prejudice to any legal rights or remedies.
                </div>
              </div>
              <div className="mt-3">
                <AIDisclaimer variant="light" />
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Add some CSS for the spinner animation */}
      <style jsx="true">{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        .legal-opinion-content {
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .legal-opinion-content h1, 
        .legal-opinion-content h2 {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .legal-opinion-content h3, 
        .legal-opinion-content h4 {
          margin-top: 1.2rem;
          margin-bottom: 0.8rem;
        }
        .legal-opinion-content table {
          width: 100%;
          margin-bottom: 1rem;
          border-collapse: collapse;
        }
        .legal-opinion-content table th,
        .legal-opinion-content table td {
          padding: 0.5rem;
          border: 1px solid #dee2e6;
        }
        .legal-opinion-content table th {
          background-color: #f8f9fa;
        }
        .legal-opinion-content blockquote {
          border-left: 4px solid #ced4da;
          padding-left: 1rem;
          color: #6c757d;
        }
        .dark-theme .legal-opinion-content,
        .dark-theme .legal-opinion-content * {
          color: var(--text-color) !important;
        }
        .dark-theme .legal-opinion-content h1,
        .dark-theme .legal-opinion-content h2,
        .dark-theme .legal-opinion-content h3,
        .dark-theme .legal-opinion-content h4 {
          color: var(--primary-color) !important;
        }
        .dark-theme .legal-opinion-content table th {
          background-color: var(--accent-color);
        }
      `}</style>
    </Container>
  );
};

export default LegalOpinion;
