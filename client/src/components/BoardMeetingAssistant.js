import React, { useState } from 'react';
import { Card, Form, Container, Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const BoardMeetingAssistant = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    dateTime: '', // DD-MM-YYYY, HH:MM AM/PM
    venueMode: 'Registered Office', // Registered Office / VC
    agendaItems: '', // bullet or comma separated
    directorsPresent: '',
    chairperson: '',
    companySecretary: '',
    specialResolutionsYesNo: 'No',
    specialResolutionsDesc: '',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    const prompt = `Create board meeting documents for a general board meeting of *${formData.companyName}*.

*Inputs:*

1. *Company Name*: ${formData.companyName}
2. *Date & Time*: ${formData.dateTime}
3. *Venue / Mode*: ${formData.venueMode}
4. *Agenda Items*: ${formData.agendaItems}
5. *Directors Present*: ${formData.directorsPresent}
6. *Chairperson*: ${formData.chairperson}
7. *Company Secretary*: ${formData.companySecretary}
8. *Special Resolutions*: ${formData.specialResolutionsYesNo}${formData.specialResolutionsYesNo === 'Yes' && formData.specialResolutionsDesc ? ` - ${formData.specialResolutionsDesc}` : ''}

*Outputs:*

- Board Meeting Notice
- Agenda
- Draft Minutes
- Resolutions (if any)

Exclude and introductory paragraph , notes , disclaimers.

`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (
            data &&
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts
          ) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the documents. Please try again.");
          }
        },
      });
    } catch (error) {
      setLoading(false);
      setResponse('An error occurred while generating the documents. Please try again later.');
      console.error('Error:', error);
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
            <h2 className="card-title">Board Meeting Assistant</h2>
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
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

              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Date & Time</Form.Label>
                    <Form.Control
                      type="text"
                      name="dateTime"
                      placeholder="DD-MM-YYYY, HH:MM AM/PM"
                      value={formData.dateTime}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Venue / Mode</Form.Label>
                    <Form.Select
                      name="venueMode"
                      value={formData.venueMode}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="Registered Office">Registered Office</option>
                      <option value="VC">VC</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Agenda Items</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="agendaItems"
                  placeholder="List agenda items e.g., 1) Appointment of Director 2) Noting of Registers"
                  value={formData.agendaItems}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Directors Present</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="directorsPresent"
                  placeholder="List directors present"
                  value={formData.directorsPresent}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Chairperson</Form.Label>
                    <Form.Control
                      type="text"
                      name="chairperson"
                      value={formData.chairperson}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Company Secretary</Form.Label>
                    <Form.Control
                      type="text"
                      name="companySecretary"
                      value={formData.companySecretary}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Special Resolutions</Form.Label>
                    <Form.Select
                      name="specialResolutionsYesNo"
                      value={formData.specialResolutionsYesNo}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">If Yes, brief description</Form.Label>
                    <Form.Control
                      type="text"
                      name="specialResolutionsDesc"
                      value={formData.specialResolutionsDesc}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={formData.specialResolutionsYesNo !== 'Yes'}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Documents...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Documents
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
            <h2 className="card-title" style={{ marginBottom: '12px' }}>Board Meeting Documents</h2>
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
                      fileName: `${formData.companyName}-board-meeting-documents.pdf`,
                      title: `Board Meeting Documents`,
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
                      fileName: `${formData.companyName}-board-meeting-documents.docx`,
                      title: `Board Meeting Documents`,
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  <span className="d-none d-sm-inline">Download Word</span>
                </button>
              </div>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
              </div>
              <AIDisclaimer variant="light" />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default BoardMeetingAssistant;
