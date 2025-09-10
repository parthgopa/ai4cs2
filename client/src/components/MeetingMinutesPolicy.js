import React, { useState } from 'react';
import { Card, Form, Container, Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const MeetingMinutesPolicy = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Meeting Minutes Policy form data
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

    const prompt = `Draft a Meeting and Minutes Policy for ${formData.companyName}, outlining procedures for convening, 
    conducting, and recording minutes of Board Meetings, General Meetings, and Extraordinary General Meetings, 
    in compliance with the Companies Act, 2013, and SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015. 
    The policy should include only exclusive details on followings with appropriate provision of Companies Act, 2013 and rules made thereunder :

- Convening Meetings:
    - Notice period and content
    - Authority to convene meetings
- Conducting Meetings:
    - Quorum requirements for Board Meetings, General Meetings, and Extraordinary General Meetings
    - Chairman and proceedings
- Recording Minutes:
    - Preparation and signing of minutes
    - Contents of minutes
- Retention and Storage:
    - Maintenance and preservation of minutes
    - Access and inspection    
    `;

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
            <h2 className="card-title">Meeting and Minutes Policy Generator</h2>

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

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Meeting and Minutes Policy...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Meeting and Minutes Policy
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
            <h2 className="card-title" style={{ marginBottom: '12px' }}>Meeting and Minutes Policy</h2>
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
                  <span className="d-none d-sm-inline">Copy to Clipboard</span>
                </button>
                <button
                  className="btn btn-outline-danger me-2"
                  onClick={() => {
                    const { generatePDF } = PDFGenerator({
                      content: response,
                      fileName: `${formData.companyName}-meeting-minutes-policy.pdf`,
                      title: `Meeting and Minutes Policy`
                    });
                    generatePDF();
                  }}
                >
                  <FaFilePdf className="me-1" />
                  <span className="d-none d-sm-inline">Download PDF</span>
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => {
                    const { generateWord } = WordGenerator({
                      content: response,
                      fileName: `${formData.companyName}-meeting-minutes-policy.docx`,
                      title: `Meeting and Minutes Policy`
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  <span className="d-none d-sm-inline">Download Word</span>
                </button>
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

export default MeetingMinutesPolicy;
