import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch, FaBook } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const MiniLawLibrary = () => {
  const [formData, setFormData] = useState({
    searchQuery: '',
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

    const prompt = `You are a Mini Law Library assistant for company secretaries, lawyers, and compliance professionals. 
Your task is to provide structured, reliable, and practical legal information whenever the user enters a **Section number + Act/Law name** OR a **keyword/concept**. 
 
Input: ${formData.searchQuery}
 
---
 
Steps:
1. If the input is ambiguous, confirm the correct section/act with the user. 
2. Then provide the following structured output in **English only**:
 
---
 
Output Format:
 
1. Section Text (Bare Act) 
   - Exact wording of the section from the official Act. 
 
2. Commentary / Explanation 
   - Clear and concise explanation in simple English. 
   - Key points, scope, applicability. 
 
3. Judicial Precedents (Case Law) 
   - Provide at least 2-3 important cases interpreting the section, each with: 
     - Case Name (Petitioner v. Respondent) 
     - Citation (e.g., (2019) 4 SCC 1; AIR 2019 SC 1234; [2019] 215 CompCas 45 (Del)) 
     - Court & Year (e.g., Supreme Court 2019, Delhi HC 2023, NCLAT 2018) 
     - Ratio / Principle decided (one-line essence) 
   - At the end, separately highlight: 
     "Most Recent Case on this Section" with full details. 
 
4. Practical Implications 
   - Compliance requirements for companies/professionals. 
   - Duties, penalties, exemptions. 
 
5. Cross References 
   - Related sections of the same Act. 
   - Relevant Rules, Notifications, Circulars. 
 
6. Quick Example 
   - A small, real-life scenario to illustrate the application of the section. 
 
---
 
Additional Rules:
- Always output in English only. 
- Always include citations with court and year. 
- If the section has been amended, show "Old vs New provision". 
- If no reported case law is found, clearly state: "No reported judgments available for this section." 
- Keep tone practical, concise, and professional for company secretaries and legal practitioners.
- Remove any introductory paragraph and end notes.`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't find the legal information. Please try again with a different search term.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while searching the law library. Please try again later.");
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
            <FaBook className="me-3" style={{ fontSize: '2rem', color: '#0d6efd' }} />
            <div>
              <h1 className="page-title mb-0">Mini-Law Library</h1>
              <p className="page-description text-muted mb-0">
                Search for legal sections, acts, and concepts with comprehensive analysis
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Legal Information Search</h2>
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Search Query</Form.Label>
                <Form.Control
                  type="text"
                  name="searchQuery"
                  value={formData.searchQuery}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 'Section 185 Companies Act 2013', 'Loans to Directors'"
                  required
                />
                <Form.Text className="text-muted">
                  You can search by section number with act name or by legal concepts and keywords.
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
                    Searching Law Library...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Search Legal Information
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
                      fileName: `law-library-${formData.searchQuery.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`,
                      title: `Legal Information - ${formData.searchQuery}`
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
                      fileName: `law-library-${formData.searchQuery.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.docx`,
                      title: `Legal Information - ${formData.searchQuery}`
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

export default MiniLawLibrary;
