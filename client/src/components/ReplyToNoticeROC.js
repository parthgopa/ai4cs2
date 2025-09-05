import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const ReplyToNoticeROC = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedNoticeType, setSelectedNoticeType] = useState('');

  // Form data for different ROC notice types
  const [formData, setFormData] = useState({
    // Common fields
    companyName: '',
    noticeDate: '',
    
    // Section 137 – Delay in Filing Financial Statement
    financialYear: '',
    reasonDelay: '',
    actionsTaken: '',
    
    // Section 92 – Delay in Filing Annual Return
    formFiledDate: '',
    srnNumber: '',
    futureSteps: '',
    
    // Section 96 – Delay in Holding AGM
    scheduledAGMDate: '',
    actualAGMDate: '',
    extensionTaken: '',
    
    // Section 117 – Delay in Filing Resolutions
    boardMeetingDate: '',
    resolutionType: '',
    dueDate: '',
    actualFilingDate: '',
    
    // Section 203 – Non-Appointment of KMP
    vacancyDate: '',
    appointmentTime: '',
    appointedNameDate: '',
    rocIntimation: '',
    
    // Section 12 – Non-maintenance/Change of Registered Office
    changeDate: '',
    reasonNonCompliance: '',
    correctionDate: '',
    supportingDocs: ''
  });

  const noticeTypes = [
    { id: 'section-137', title: 'Section 137 – Delay in Filing Financial Statement' },
    { id: 'section-92', title: 'Section 92 – Delay in Filing Annual Return' },
    { id: 'section-96', title: 'Section 96 – Delay in Holding AGM' },
    { id: 'section-117', title: 'Section 117 – Delay in Filing Resolutions' },
    { id: 'section-203', title: 'Section 203 – Non-Appointment of KMP' },
    { id: 'section-12', title: 'Section 12 – Non-maintenance/Change of Registered Office' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNoticeTypeChange = (e) => {
    setSelectedNoticeType(e.target.value);
    setResponse(''); // Clear previous response when changing notice type
  };

  const generatePrompt = () => {
    let prompt = '';

    switch (selectedNoticeType) {
      case 'section-137':
        prompt = `Draft a reply to a Show Cause Notice under Section 137 of the Companies Act, 2013 for delay in filing of financial statements.

Company Name: ${formData.companyName}
Financial Year: ${formData.financialYear}
Date of Notice Received: ${formData.noticeDate}
Reason for Delay: ${formData.reasonDelay}
Actions Taken: ${formData.actionsTaken}

The reply should be formal, concise, and address the concern of the Registrar of Companies, explaining the cause of delay and commitment to timely compliance in future.`;
        break;

      case 'section-92':
        prompt = `Draft a reply to a Show Cause Notice under Section 92 of the Companies Act, 2013 for delay in filing of Annual Return (Form MGT-7 or MGT-7A).

Company Name: ${formData.companyName}
Financial Year: ${formData.financialYear}
Date of Notice Received: ${formData.noticeDate}
Reason for Delay: ${formData.reasonDelay}
Date of Form Filed: ${formData.formFiledDate}
SRN of Form: ${formData.srnNumber}
Steps taken to avoid such delay in future: ${formData.futureSteps}

The reply should be courteous and explain the unintentional delay while highlighting the company's commitment to future compliance.`;
        break;

      case 'section-96':
        prompt = `Draft a reply to a Show Cause Notice under Section 96 of the Companies Act, 2013 regarding delay in holding Annual General Meeting.

Company Name: ${formData.companyName}
Financial Year: ${formData.financialYear}
Date of Notice Received: ${formData.noticeDate}
Scheduled Date of AGM: ${formData.scheduledAGMDate}
Actual Date of AGM: ${formData.actualAGMDate}
Reason for Delay: ${formData.reasonDelay}
Extension Taken from ROC: ${formData.extensionTaken}

Please ensure the tone is respectful and clarify the reason for delay along with any approvals or extensions obtained.`;
        break;

      case 'section-117':
        prompt = `Draft a reply to a Show Cause Notice under Section 117 of the Companies Act, 2013 for delay in filing of resolutions (MGT-14).

Company Name: ${formData.companyName}
Date of Board Meeting: ${formData.boardMeetingDate}
Type of Resolution: ${formData.resolutionType}
Due Date of Filing: ${formData.dueDate}
Actual Date of Filing: ${formData.actualFilingDate}
Reason for Delay: ${formData.reasonDelay}
SRN (if now filed): ${formData.srnNumber}

The reply should be clear, express regret for delay, and demonstrate willingness to comply henceforth.`;
        break;

      case 'section-203':
        prompt = `Draft a reply to a Show Cause Notice under Section 203 of the Companies Act, 2013 regarding delay or failure in appointment of Key Managerial Personnel (KMP).

Company Name: ${formData.companyName}
Date on which Vacancy Arose: ${formData.vacancyDate}
Time Taken to Appoint KMP: ${formData.appointmentTime}
Reason for Delay: ${formData.reasonDelay}
Name and Date of Appointment: ${formData.appointedNameDate}
Whether Intimation Made to ROC: ${formData.rocIntimation}

The reply should be professional and include reasons and rectification, with assurance of compliance.`;
        break;

      case 'section-12':
        prompt = `Draft a reply to a Show Cause Notice under Section 12 of the Companies Act, 2013 regarding non-maintenance or change in Registered Office without proper intimation.

Company Name: ${formData.companyName}
Date of Change in Registered Office: ${formData.changeDate}
Date of Notice Received: ${formData.noticeDate}
Reason for Non-compliance: ${formData.reasonNonCompliance}
Date on which correction was made: ${formData.correctionDate}
Supporting Documents: ${formData.supportingDocs}

Reply must show the company's intent to comply, explain the lapse, and detail corrective actions taken.`;
        break;

      default:
        return '';
    }

    return prompt;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNoticeType) {
      alert('Please select a notice type first.');
      return;
    }

    setLoading(true);
    setResponse('');

    const prompt = generatePrompt();

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

  const renderCommonFields = () => (
    <>
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

      <Form.Group className="form-group">
        <Form.Label className="form-label">Date of Notice Received</Form.Label>
        <Form.Control
          type="date"
          name="noticeDate"
          value={formData.noticeDate}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </Form.Group>
    </>
  );

  const renderFormFields = () => {
    if (!selectedNoticeType) return null;

    return (
      <>
        {renderCommonFields()}
        
        {selectedNoticeType === 'section-137' && (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Financial Year</Form.Label>
              <Form.Control
                type="text"
                name="financialYear"
                value={formData.financialYear}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., 2023-24"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Delay</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reasonDelay"
                value={formData.reasonDelay}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Actions Taken</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="actionsTaken"
                value={formData.actionsTaken}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
          </>
        )}
        
        {selectedNoticeType === 'section-92' && (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Financial Year</Form.Label>
              <Form.Control
                type="text"
                name="financialYear"
                value={formData.financialYear}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., 2023-24"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Delay</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reasonDelay"
                value={formData.reasonDelay}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Form Filed</Form.Label>
                  <Form.Control
                    type="date"
                    name="formFiledDate"
                    value={formData.formFiledDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">SRN of Form</Form.Label>
                  <Form.Control
                    type="text"
                    name="srnNumber"
                    value={formData.srnNumber}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Steps taken to avoid such delay in future</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="futureSteps"
                value={formData.futureSteps}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
          </>
        )}
        
        {selectedNoticeType === 'section-96' && (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Financial Year</Form.Label>
              <Form.Control
                type="text"
                name="financialYear"
                value={formData.financialYear}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., 2023-24"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Scheduled Date of AGM</Form.Label>
                  <Form.Control
                    type="date"
                    name="scheduledAGMDate"
                    value={formData.scheduledAGMDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Actual Date of AGM</Form.Label>
                  <Form.Control
                    type="date"
                    name="actualAGMDate"
                    value={formData.actualAGMDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Delay</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reasonDelay"
                value={formData.reasonDelay}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Extension Taken from ROC</Form.Label>
              <Form.Select
                name="extensionTaken"
                value={formData.extensionTaken}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>
          </>
        )}
        
        {selectedNoticeType === 'section-117' && (
          <>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Board Meeting</Form.Label>
                  <Form.Control
                    type="date"
                    name="boardMeetingDate"
                    value={formData.boardMeetingDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Type of Resolution</Form.Label>
                  <Form.Control
                    type="text"
                    name="resolutionType"
                    value={formData.resolutionType}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., Board Resolution, Special Resolution"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Due Date of Filing</Form.Label>
                  <Form.Control
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Actual Date of Filing</Form.Label>
                  <Form.Control
                    type="date"
                    name="actualFilingDate"
                    value={formData.actualFilingDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Delay</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reasonDelay"
                value={formData.reasonDelay}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">SRN (if now filed)</Form.Label>
              <Form.Control
                type="text"
                name="srnNumber"
                value={formData.srnNumber}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
          </>
        )}
        
        {selectedNoticeType === 'section-203' && (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Date on which Vacancy Arose</Form.Label>
              <Form.Control
                type="date"
                name="vacancyDate"
                value={formData.vacancyDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Time Taken to Appoint KMP</Form.Label>
              <Form.Control
                type="text"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., 45 days, 2 months"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Delay</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reasonDelay"
                value={formData.reasonDelay}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Name and Date of Appointment</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="appointedNameDate"
                value={formData.appointedNameDate}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Name of appointed person and date of appointment"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Whether Intimation Made to ROC</Form.Label>
              <Form.Select
                name="rocIntimation"
                value={formData.rocIntimation}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>
          </>
        )}
        
        {selectedNoticeType === 'section-12' && (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Date of Change in Registered Office</Form.Label>
              <Form.Control
                type="date"
                name="changeDate"
                value={formData.changeDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Non-compliance</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reasonNonCompliance"
                value={formData.reasonNonCompliance}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Date on which correction was made</Form.Label>
              <Form.Control
                type="date"
                name="correctionDate"
                value={formData.correctionDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Supporting Documents</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="supportingDocs"
                value={formData.supportingDocs}
                onChange={handleInputChange}
                className="form-control"
                placeholder="List of supporting documents provided"
              />
            </Form.Group>
          </>
        )}
      </>
    );
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Reply to Notice - ROC Generator</h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Select ROC Notice Type</Form.Label>
                <Form.Select
                  value={selectedNoticeType}
                  onChange={handleNoticeTypeChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a notice type...</option>
                  {noticeTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {renderFormFields()}

              {selectedNoticeType && (
                <button type="submit" className="features-button" disabled={loading}>
                  {loading ? (
                    <>
                      <FaSpinner className="spinner me-2" />
                      Generating Reply...
                    </>
                  ) : (
                    <>
                      <FaSearch className="me-2" />
                      Generate Reply to ROC Notice
                    </>
                  )}
                </button>
              )}
            </Form>
          </Card>
        </Col>
      </Row>

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            <h1 className="card-title" style={{ marginBottom: '6px' }}>{formData.companyName} -</h1>
            <h2 className="card-title" style={{ marginBottom: '12px' }}>Reply to ROC Notice</h2>
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
                      fileName: `${formData.companyName}-reply-to-roc-notice.pdf`,
                      title: `Reply to ROC Notice`
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
                      fileName: `${formData.companyName}-reply-to-roc-notice.docx`,
                      title: `Reply to ROC Notice`
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
            </Card>
            <AIDisclaimer variant="light" />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ReplyToNoticeROC;
