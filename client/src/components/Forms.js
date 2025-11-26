import React, { useState } from 'react';
import { Card, Form, Container, Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaFileAlt } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const Forms = () => {
  const [formData, setFormData] = useState({
    companyName: '',
  });

  const [loading, setLoading] = useState(false);
  const [combinedResponse, setCombinedResponse] = useState('');

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
    setCombinedResponse('');

    const promptPart1 = `Generate a brief list of statutory forms under India's Companies Act, 2013, referencing official MCA data. If any detail is unverified, state "(Verify on MCA)".

Title "Exhaustive Event-wise List of Statutory Forms under the Companies Act, 2013 "

Formatting Rules:
* Use a dot point format only; **no tables**.
* Bold all headings and sub-headings.
* Use strict indentation: 1. for main categories, - for forms, and • for form details.
* For each form, provide the following details in this specific order:
    * Form:
    * Section/Rule:
    * Purpose:
    * Due Date:
    * Non-Compliance:
    * Notes (if any):

**Content Structure**:
Organize all forms under these exact categories in the specified order:
1.  Incorporation & Registration
2.  Annual Filings
3.  Director & KMP-related
4.  Charge-related
5.  Share Capital & Debenture-related

Provide brief details for each form in these 5 categories only.
`;

    try {
      await APIService({
        question: promptPart1,
        retries: 3,
        onResponse: (data) => {
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const part1Text = data.candidates[0].content.parts[0].text;
            // Automatically trigger Part 2 API call
            handlePart2Submit(part1Text);
          } else {
            setLoading(false);
            setCombinedResponse("Sorry, we couldn't generate the forms list. Please try again.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setCombinedResponse("An error occurred while generating the forms list. Please try again later.");
      console.error("Error:", error);
    }
  };

  const handlePart2Submit = async (part1Text) => {
    const promptPart2 = `Generate a brief list of statutory forms under India's Companies Act, 2013, referencing official MCA data. If any detail is unverified, state "(Verify on MCA)".

Formatting Rules:
* Use a dot point format only; **no tables**.
* Bold all headings and sub-headings.
* Use strict indentation: 1. for main categories, - for forms, and • for form details.
* For each form, provide the following details in this specific order:
    * Form:
    * Section/Rule:
    * Purpose:
    * Due Date:
    * Non-Compliance:
    * Notes (if any):

**Content Structure**:
Organize all forms under these exact categories in the specified order:

Provide details for each form in these 5 categories plus the concluding sections.
`;

    try {
      await APIService({
        question: promptPart2,
        retries: 3,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const part2Text = data.candidates[0].content.parts[0].text;
            const combined = part1Text + '\n\n' + part2Text;
            setCombinedResponse(combined);
          } else {
            const errorMsg = "Sorry, we couldn't generate the second part of the forms list. Please try again.";
            setCombinedResponse(part1Text + '\n\n' + errorMsg);
          }
        }
      });
      

    } catch (error) {
      setLoading(false);
      const errorMsg = "An error occurred while generating the second part of the forms list. Please try again later.";
      setCombinedResponse(part1Text + '\n\n' + errorMsg);
      console.error("Error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };


  // const copyToClipboard = (content) => {
  //   navigator.clipboard.writeText(content);
  //   alert('Content copied to clipboard!');
  // };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(combinedResponse);
    alert('Complete forms list copied to clipboard!');
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Statutory Forms List Generator</h2>
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter company name"
                  required
                />
              </Form.Group>

              <button type="submit" className="features-button" disabled={loading || !formData.companyName.trim()}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Forms List...
                  </>
                ) : (
                  <>
                    <FaFileAlt className="me-2" />
                    Generate Statutory Forms List
                  </>
                )}
              </button>
            </Form>
          </Card>
        </Col>
      </Row>

      {combinedResponse && (
        <Row className="justify-content-center mt-4">
          <Col md={10}>
            <h2 className="card-title" style={{marginBottom:'12px'}}>Statutory Forms List for {formData.companyName}</h2>
            <Card className="output-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="card-title mb-0">Statutory Forms List</h3>
                <div className="export-buttons">
                  <button onClick={copyToClipboard} className="btn btn-outline-primary me-2">
                    <FaCopy className="me-1" /> Copy All
                  </button>
                  <button
                    className="btn btn-outline-danger me-2"
                    onClick={() => {
                      const { generatePDF } = PDFGenerator({
                        content: combinedResponse,
                        fileName: `${formData.companyName}_Statutory_Forms_List.pdf`,
                        title: `Statutory Forms List`
                      });
                      generatePDF();
                    }}
                  >
                    <FaFilePdf className="me-1" /> PDF
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => {
                      const { generateWord } = WordGenerator({
                        content: combinedResponse,
                        fileName: `${formData.companyName}_Statutory_Forms_List.docx`,
                        title: `Statutory Forms List`
                      });
                      generateWord();
                    }}
                  >
                    <FaFileWord className="me-1" /> Word
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center my-4">
                  <FaSpinner className="spinner me-2" />
                  <span>Generating complete statutory forms list...</span>
                </div>
              ) : (
                <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{combinedResponse}</ReactMarkdown>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}

      <Row className="justify-content-center mt-4">
        <Col md={10}>
          <AIDisclaimer variant="light" />
        </Col>
      </Row>
    </Container>
  );
};

export default Forms;
