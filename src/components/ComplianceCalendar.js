import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../API';
import { FaCopy, FaFilePdf } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import AIDisclaimer from './AIDisclaimer';


const ComplianceCalendar = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: 'Private Limited Company',
    // year: '2026',
    quarterlyOptions: ['January to March'],
    financialEndDate: '',
    complianceFor: ['Companies Act 2013', 'Goods and Services Tax (GST)',
       'Income Tax Act', 'Reserve Bank of India (RBI) regulations', 
       'Non-Banking Financial Companies (NBFC) regulations', 'Foreign Exchange Management Act (FEMA)', 
       'SEBI (Listing Obligations and Disclosure Requirements and other applicable regulations)'],
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

  const handleApplicableCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        complianceFor: [...formData.complianceFor, value],
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
    
    const prompt = `
Give following details
1.\tName of the company - ${formData.companyName} 
2.\tCompany Type - ${formData.companyType} 
3.\tLatest Financial year and date - ${formData.financialEndDate}
4.\tQuarterly options - ${formData.quarterlyOptions.join(', ')}
5.\tApplicable laws - ${complianceForString} 
6.\tCalendar type- detailed

Based on the information provided above, generate a detailed statutory compliance calendar.

The compliance calendar should:

Include all applicable statutory filings and compliance requirements under the mentioned laws, along with the relevant sections, subsections, and rules there under.

Clearly mention the exact due dates, name of the applicable Act, relevant provision (section/subsection/rule/form number), and a brief description of the compliance.

Specify the consequences in detail of non-compliance , if any (such as penalties, late fees, disqualification, or prosecution).

Provide additional remarks, wherever necessary (e.g., optional but recommended filings, industry-specific variations).


The output should be in a note-style format grouped by month and date, as shown below:

Month: January
Date: 01
Act/Regulation: Companies Act, 2013
Compliance Description: Holding of Annual General Meeting
Applicable Provision: Section 96(1)
Consequences of Non-Compliance: Penalty on company and officers in default as per Section 99
Remarks: Mandatory for all companies except OPC

`;
// console.log(prompt);

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

  const complianceOptions = [
    { value: 'Companies Act 2013', label: 'Companies Act 2013' },
    { value: 'Goods and Services Tax (GST)', label: 'Goods and Services Tax (GST)' },
    { value: 'Income Tax Act', label: 'Income Tax Act' },
    { value: 'Reserve Bank of India (RBI) regulations', label: 'Reserve Bank of India (RBI) regulations' },
    { value: 'Non-Banking Financial Companies (NBFC) regulations', label: 'Non-Banking Financial Companies (NBFC) regulations' },
    { value: 'Foreign Exchange Management Act (FEMA)', label: 'Foreign Exchange Management Act (FEMA)' },
    { value: 'SEBI (Listing Obligations and Disclosure Requirements and other applicable regulations)', label: 'SEBI (Listing Obligations and Disclosure Requirements and other applicable regulations)' }
  ];

  const quarterlyOptions = [    
    { value: 'April to June', label: 'April to June' },
    { value: 'July to September', label: 'July to September' },
    { value: 'October to December', label: 'October to December' },
    { value: 'January to March', label: 'January to March' },
  ];

  const handleQuarterlyCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        quarterlyOptions: [...formData.quarterlyOptions, value],
      });
    } else {
      setFormData({
        ...formData,
        quarterlyOptions: formData.quarterlyOptions.filter(item => item !== value)
      });
    }
  };

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
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Unlisted public Limited">Unlisted public Limited</option>
                  <option value="listed public Limited">listed public Limited</option>
                </Form.Select>
              </Form.Group>

              {/* <Form.Group className="form-group">
                <Form.Label className="form-label">Year</Form.Label>
                <Form.Control
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group> */}

              {/* add a caleder for selecting finiancial end date abd year */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Financial End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="financialEndDate"
                  value={formData.financialEndDate}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </Form.Group>

              {/* Now quaterly compliance calendar, add a 4 checkbox Q1,Q2,Q3,Q4 where Q1 - january to march, Q2 - april to june, Q3 - july to september, Q4 - october to december */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Quarterly Compliance Calendar</Form.Label>
                <div>
                  {quarterlyOptions.map((option) => (
                    <Form.Check
                      key={option.value}
                      type="checkbox"
                      id={`quarterly-compliance-calendar-${option.value}`}
                      label={option.label}
                      value={option.value}
                      checked={formData.quarterlyOptions.includes(option.value)}
                      onChange={handleQuarterlyCheckboxChange}
                      className="form-check"
                    />
                  ))}
                </div>
              </Form.Group> 


              <Form.Group className="form-group">
                <Form.Label className="form-label">Applicable Laws</Form.Label>
                <div>
                  {complianceOptions.map((option) => (
                    <Form.Check
                      key={option.value}
                      type="checkbox"
                      id={`compliance-${option.value}`}
                      label={option.label}
                      value={option.value}
                      checked={formData.complianceFor.includes(option.value)}
                      onChange={handleApplicableCheckboxChange}
                      className="form-check"
                    />
                  ))}
                </div>
              </Form.Group>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Generating Calendar...' : 'Generate Compliance Calendar'}
              </button>
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
          <h2 className="card-title">Compliance Calendar</h2>
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
                      fileName: `${formData.companyName}-compliance-calendar.pdf` 
                    });
                    generatePDF();
                  }}
                >
                  <FaFilePdf className="me-1" />
                  <span className="d-none d-sm-inline">Download PDF</span>
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

export default ComplianceCalendar;
