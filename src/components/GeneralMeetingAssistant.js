import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const GeneralMeetingAssistant = () => {
  const [formData, setFormData] = useState({
    documentType: 'Notice', // Notice or Minutes
    meetingType: 'AGM', // AGM or EGM
    companyName: '',
    financialYear: '', // only for AGM
    meetingDate: '', // DD-MM-YYYY
    meetingTime: '', // HH:MM AM/PM
    meetingModeOrVenue: '', // Physical at [Address] / VC / Hybrid
    chairperson: '',
    companySecretary: '',
    agendaItemsAndResolutions: '', // list items with resolution type
    recordDateOrBookClosure: 'No',
    recordDateDetails: '',
    explanatoryStatementRequired: 'No',
    explanatoryStatement: '',
    attendeesList: '', // only for Minutes
    votingMode: 'Show of Hands', // only for Minutes
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    const prompt = `You are a qualified Company Secretary. Based on the user inputs, generate either a **Notice** or **Minutes** of an **AGM/EGM** in accordance with the Companies Act, 2013 and Secretarial Standard-2 (SS-2).

Ensure:
- Proper legal formatting
- Inclusion of relevant Sections (Sec 101, 102, 118, etc.)
- Clear listing of agenda items and resolution types (Ordinary/Special)

If \`Document_Type = Minutes\`, also include:
- Attendance
- Quorum
- Summary of proceedings
- Voting mode
- Outcome of each resolution

Final output must be professionally drafted and ready for compliance or record-keeping.
 
\ud83d\udce4 Expected Output:
• A clean, compliant Notice or Minutes document
• Legally formatted and ready to use
• Includes correct referencing, quorum confirmation, and resolution summaries

Notes: Shortcut Names: agm01 → Annual General Meeting (AGM), egm01 → Extraordinary General Meeting (EGM)

Inputs Provided:
1. Document_Type: ${formData.documentType}
2. Meeting_Type: ${formData.meetingType}
3. Company_Name: ${formData.companyName}
4. Financial_Year: ${formData.meetingType === 'AGM' ? formData.financialYear : 'N/A'}
5. Meeting_Date: ${formData.meetingDate}
6. Meeting_Time: ${formData.meetingTime}
7. Meeting_Mode_or_Venue: ${formData.meetingModeOrVenue}
8. Chairperson: ${formData.chairperson}
9. Company_Secretary: ${formData.companySecretary}
10. Agenda_Items_and_Resolutions: ${formData.agendaItemsAndResolutions}
11. Record_Date_or_Book_Closure: ${formData.recordDateOrBookClosure}${formData.recordDateOrBookClosure === 'Yes' && formData.recordDateDetails ? ` - ${formData.recordDateDetails}` : ''}
12. Explanatory_Statement_Required: ${formData.explanatoryStatementRequired}${formData.explanatoryStatementRequired === 'Yes' && formData.explanatoryStatement ? ` - ${formData.explanatoryStatement}` : ''}
13. Attendees_List: ${formData.documentType === 'Minutes' ? formData.attendeesList : 'N/A'}
14. Voting_Mode: ${formData.documentType === 'Minutes' ? formData.votingMode : 'N/A'}
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
            setResponse("Sorry, we couldn't generate the document. Please try again.");
          }
        },
      });
    } catch (error) {
      setLoading(false);
      setResponse('An error occurred while generating the document. Please try again later.');
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
            <h2 className="card-title">General Meeting Assistant</h2>
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Document Type</Form.Label>
                    <Form.Select
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="Notice">Notice</option>
                      <option value="Minutes">Minutes</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Meeting Type</Form.Label>
                    <Form.Select
                      name="meetingType"
                      value={formData.meetingType}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="AGM">AGM </option>
                      <option value="EGM">EGM</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

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

              {formData.meetingType === 'AGM' && (
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Financial Year (Only for AGM)</Form.Label>
                  <Form.Control
                    type="date"
                    name="financialYear"
                    placeholder="e.g., FY 2024–25"
                    value={formData.financialYear}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Meeting Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="meetingDate"
                      placeholder="DD-MM-YYYY"
                      value={formData.meetingDate}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Meeting Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="meetingTime"
                      placeholder="HH:MM AM/PM"
                      value={formData.meetingTime}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Give 3 dropdown :  [Address] / VC / Hybrid*/}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Meeting Mode or Venue</Form.Label>
                <Form.Select
                  name="meetingModeOrVenue"
                  placeholder="Physical at [Address] / VC / Hybrid"
                  value={formData.meetingModeOrVenue}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                <option value="AGM">Address </option>
                <option value="EGM">VC</option>
                <option value="EGM">Hybrid</option>
                </Form.Select>
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

              <Form.Group className="form-group">
                <Form.Label className="form-label">Agenda Items and Resolutions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="agendaItemsAndResolutions"
                  placeholder="List each item with its resolution type (Ordinary/Special)"
                  value={formData.agendaItemsAndResolutions}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Record Date or Book Closure</Form.Label>
                    <Form.Select
                      name="recordDateOrBookClosure"
                      value={formData.recordDateOrBookClosure}
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
                    <Form.Label className="form-label">If Yes, provide relevant dates</Form.Label>
                    <Form.Control
                      type="text"
                      name="recordDateDetails"
                      value={formData.recordDateDetails}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={formData.recordDateOrBookClosure !== 'Yes'}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Explanatory Statement Required</Form.Label>
                    <Form.Select
                      name="explanatoryStatementRequired"
                      value={formData.explanatoryStatementRequired}
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
                    <Form.Label className="form-label">If Yes, brief explanation</Form.Label>
                    <Form.Control
                      type="text"
                      name="explanatoryStatement"
                      value={formData.explanatoryStatement}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={formData.explanatoryStatementRequired !== 'Yes'}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {formData.documentType === 'Minutes' && (
                <>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Attendees List (Directors/Shareholders Present)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="attendeesList"
                      value={formData.attendeesList}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Voting Mode</Form.Label>
                    <Form.Select
                      name="votingMode"
                      value={formData.votingMode}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="Show of Hands">Show of Hands</option>
                      <option value="E-voting">E-voting</option>
                      <option value="Postal Ballot">Postal Ballot</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              <button type="submit" className="features-button" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Document...
                  </>
                ) : (
                  <>
                    <FaSearch className="me-2" />
                    Generate Document
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
            <h2 className="card-title" style={{ marginBottom: '12px' }}>{formData.documentType} of {formData.meetingType}</h2>
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
                      fileName: `${formData.companyName}-${formData.documentType.toLowerCase()}-${formData.meetingType.toLowerCase()}.pdf`,
                      title: `${formData.documentType} - ${formData.meetingType}`,
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
                      fileName: `${formData.companyName}-${formData.documentType.toLowerCase()}-${formData.meetingType.toLowerCase()}.docx`,
                      title: `${formData.documentType} - ${formData.meetingType}`,
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  <span className="d-none d-sm-inline">Download Word</span>
                </Button>
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

export default GeneralMeetingAssistant;
