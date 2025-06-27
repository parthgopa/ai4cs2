import React, { useState } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../API';

const ComplianceCalendar = () => {
  const [formData, setFormData] = useState({
    companyName: 'ABC Limited',
    companyType: 'public limited company',
    year: '2026',
    complianceFor: ['Companies Act 2013', 'GST', 'income tax', 'RBI', 'nbfc', 'FEMA', 'SEBI'],
    calendarType: 'detail'
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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        complianceFor: [...formData.complianceFor, value]
      });
    } else {
      setFormData({
        ...formData,
        complianceFor: formData.complianceFor.filter(item => item !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    const complianceForString = formData.complianceFor.join(', ');
    
    const prompt = `Compliance calendar 
Prompt 
Give following details
1.\tName of the company - ${formData.companyName} 
2.\tType - ${formData.companyType} 
3.\tYear - ${formData.year}
4.\tCompliance for - ${complianceForString} 
5.\tCalendar type- ${formData.calendarType}
 Based on above information Generate a structured detailed compliance calendar for that includes all monthly statutory filings and deadlines and consequences for non complaint applicable to both private limited companies and public limited companies listed on a stock exchange in India. The calendar should include compliance requirements under the laws (${complianceForString}).
Output as under
${formData.calendarType === 'detail' ? 
`If calendar type is detail then
A. Structureed output in following note format with [${formData.companyName}, ${formData.companyType}, ${formData.year}]
1 month and year
2 date 
3 respective act ,
4  compliance detail ,
5. consequences for non compliance 
4 remarks` : 
`If calendar type is summary then output is as under:
B. Handy ready reckoner style -
 month 
     date 
         Act
              Compliance`}`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
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

  const complianceOptions = [
    { value: 'Companies Act 2013', label: 'Companies Act 2013' },
    { value: 'GST', label: 'GST' },
    { value: 'income tax', label: 'Income Tax' },
    { value: 'RBI', label: 'RBI' },
    { value: 'nbfc', label: 'NBFC' },
    { value: 'FEMA', label: 'FEMA' },
    { value: 'SEBI', label: 'SEBI' }
  ];

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Compliance Calendar Generator</h2>
            <Form onSubmit={handleSubmit}>
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
                <Form.Label className="form-label">Company Type</Form.Label>
                <Form.Select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="private limited company">Private Limited Company</option>
                  <option value="public limited company">Public Limited Company</option>
                  <option value="one person company">One Person Company</option>
                  <option value="limited liability partnership">Limited Liability Partnership</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Year</Form.Label>
                <Form.Control
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Compliance For</Form.Label>
                <div>
                  {complianceOptions.map((option) => (
                    <Form.Check
                      key={option.value}
                      type="checkbox"
                      id={`compliance-${option.value}`}
                      label={option.label}
                      value={option.value}
                      checked={formData.complianceFor.includes(option.value)}
                      onChange={handleCheckboxChange}
                      className="form-check"
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Calendar Type</Form.Label>
                <Form.Select
                  name="calendarType"
                  value={formData.calendarType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="detail">Detailed</option>
                  <option value="summary">Summary</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" className="btn-primary btn-block" disabled={loading}>
                {loading ? 'Generating Calendar...' : 'Generate Compliance Calendar'}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {loading && (
        <Row className="justify-content-center">
          <Col md={10}>
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          </Col>
        </Row>
      )}

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="output-card">
              <h2 className="card-title">Compliance Calendar</h2>
              <div className="markdown-content">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ComplianceCalendar;
