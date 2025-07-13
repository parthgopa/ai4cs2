import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaPlus, FaFileWord } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const RegulatoryUpdation = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get the names of the last 3 months
  const getLastMonths = (count) => {
    const months = [];
    for (let i = count; i > 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i + 1 < 0 ? currentYear - 1 : currentYear;
      const monthName = new Date(year, monthIndex, 1).toLocaleString('default', { month: 'long' });
      months.push({ name: monthName, year: year });
    }
    return months;
  };

  const [formData, setFormData] = useState({
    selectedRegulations: ['Companies Act 2013', 'SEBI regulations', 'FEMA rules'],
    customRegulation: '',
    monthsCount: 3,
  });

  const [lastMonths, setLastMonths] = useState(getLastMonths(3));
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegulationCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        selectedRegulations: [...formData.selectedRegulations, value],
      });
    } else {
      setFormData({
        ...formData,
        selectedRegulations: formData.selectedRegulations.filter(item => item !== value)
      });
    }
  };

  const handleAddCustomRegulation = () => {
    if (formData.customRegulation.trim() !== '' && !formData.selectedRegulations.includes(formData.customRegulation.trim())) {
      setFormData({
        ...formData,
        selectedRegulations: [...formData.selectedRegulations, formData.customRegulation.trim()],
        customRegulation: ''
      });
    }
  };

  const handleMonthsCountChange = (e) => {
    const count = parseInt(e.target.value);
    setFormData({
      ...formData,
      monthsCount: count
    });
    setLastMonths(getLastMonths(count));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    const regulationsString = formData.selectedRegulations.join(', ');
    const monthsString = lastMonths.map(month => `${month.name} ${month.year}`).join(', ');
    
    const prompt = `
Prepare a professional, structured regulatory update report with the following specifications:

📌 Laws to Cover:
${regulationsString}

📆 Period of Review:
${monthsString} , July 2025

🎯 Objectives:

1. For each update, clearly mention:
• Date of Notification / Circular / Amendment
• Date of Effect (if different)

2. For each change, include:

Previous Provision (if applicable)

Revised / New Provision

Relevant Section / Rule / Regulation Number

3. Add any newly introduced:

Procedures (e.g., filing, disclosures, approvals)

Compliance Timelines


4. Summarize:

Best Practices emerging from these changes

Industry Trends or Regulatory Intent

⚠ Important Formatting Instructions:

Do not include any preface, summary, introduction, or disclaimer.

Structure content under proper headings for each law.

Add the bolded line below at the end:

"By AI - recheck it by legal professionals"

Omit any preface note, conclusion note, end note and disclaimer.
`;
// console.log(prompt);
    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate regulatory updates. Please try again.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the regulatory updates. Please try again later.");
      console.error("Error:", error);
    }
  };

  const monthOptions = [
    { value: 1, label: '1 month' },
    { value: 2, label: '2 months' },
    { value: 3, label: '3 months' },
    { value: 4, label: '4 months' },
    { value: 5, label: '5 months' },
    { value: 6, label: '6 months' },
    { value: 7, label: '7 months' },
    { value: 8, label: '8 months' },
    { value: 9, label: '9 months' },
    { value: 10, label: '10 months' },
    { value: 11, label: '11 months' },
    { value: 12, label: '12 months' }
  ];

  const defaultRegulations = [
    { value: 'Companies Act 2013', label: 'Companies Act 2013' },
    { value: 'SEBI regulations', label: 'SEBI regulations' },
    { value: 'FEMA rules', label: 'FEMA rules' }
  ];

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Regulatory Updation</h2>
            <Form onSubmit={handleSubmit}>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Applicable Regulations</Form.Label>
                <div>
                  {defaultRegulations.map((option) => (
                    <Form.Check
                      key={option.value}
                      type="checkbox"
                      id={`regulation-${option.value}`}
                      label={option.label}
                      value={option.value}
                      checked={formData.selectedRegulations.includes(option.value)}
                      onChange={handleRegulationCheckboxChange}
                      className="form-check"
                    />
                  ))}
                  {formData.selectedRegulations
                    .filter(reg => !defaultRegulations.some(defaultReg => defaultReg.value === reg))
                    .map((customReg) => (
                      <Form.Check
                        key={customReg}
                        type="checkbox"
                        id={`regulation-${customReg}`}
                        label={customReg}
                        value={customReg}
                        checked={true}
                        onChange={handleRegulationCheckboxChange}
                        className="form-check"
                      />
                    ))}
                </div>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Add Custom Regulation</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    name="customRegulation"
                    value={formData.customRegulation}
                    onChange={handleInputChange}
                    className="form-control me-2"
                    placeholder="Enter regulation name"
                  />
                  <Button 
                    variant="outline-primary" 
                    onClick={handleAddCustomRegulation}
                    disabled={!formData.customRegulation.trim()}
                  >
                    <FaPlus />
                  </Button>
                </div>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Period of Changes</Form.Label>
                <Form.Select
                  name="monthsCount"
                  value={formData.monthsCount}
                  onChange={handleMonthsCountChange}
                  className="form-select"
                  required
                >
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted mt-2 mb-2">
                  Selected period: {lastMonths.map(month => `${month.name} ${month.year}`).join(', ')}
                </Form.Text>
              </Form.Group>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Generating Updates...' : 'Generate Regulatory Updates'}
              </button>
            </Form>
          </Card>
        </Col>
      </Row>

      {loading && (
        <Row className="justify-content-center">
          <Col md={10}>
            <div className="loading-container">
              <FaSpinner style={{animation: 'spin 1s linear infinite', fontSize: '3rem', color: 'gray' }} />
            </div>
          </Col>
        </Row>
      )}

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            {/* <h1 className="card-title" style={{marginBottom:'6px'}}> {formData.companyName} -</h1> */}
            <h2 className="card-title" style={{marginBottom:'12px'}}>Regulatory Updates</h2>
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
                      fileName: `Regulatory-updates of last ${formData.monthsCount} months.pdf` ,
                      title: `Regulatory Updates`
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
                      fileName: `Regulatory-updates of last ${formData.monthsCount} months.docx` ,
                      title: `Regulatory Updates`
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
              <AIDisclaimer variant="light" />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default RegulatoryUpdation;
