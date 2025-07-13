import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';


const ComplianceCalendar = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: 'Private Limited Company',
    // year: '2026',
    quarterlyOptions: [''],
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
Given following details
1.\tName of the company - ${formData.companyName} 
2.\tCompany Type - ${formData.companyType} 
3.\tLast Financial year and date - ${formData.financialEndDate}
4.\tQuarterly options - ${formData.quarterlyOptions.join(', ')}
5.\tApplicable laws - Companies Act 2013 and rules and regulations thereunder, SEBI (LODR)[in case of privated limited company and unlisted public limited company, ignore SEBI (LODR)] . 
6.\tCalendar type- detailed

Task: Generate a detailed Statutory Compliance Calendar for  ${formData.companyName} ${formData.companyType} 
for the ${formData.quarterlyOptions.join(', ')} quarter following the financial year ending ${formData.financialEndDate}. 
Exclude any introductory notes,end note, prefaces, or disclaimers, warnings through the output( like (Note: This calendar is a simplified representation and may not cover all compliance requirements. Professional advice should be sought for comprehensive compliance.)).
The calendar should be organized as follows( in "dot points"): 

  1.  Quarter: [Selected Quarter] (e.g., Q1)
    2.  Months within the Quarter: (e.g., April, May, June)
           Act: [Name of the Act, e.g., Companies Act 2013]
               Date: [Specific Date for Compliance]
                   Compliance Item: [description in detail, e.g., Provision of the Act with Section and Subsection number .]
                   Governing Act & Section: [Specify the Act and Section number from which the compliance item originates.]
                   Applicable Form (if any): [Name of the form required for compliance, e.g., Form GSTR-3B, Form ITR-6, etc.]
                   Due Date: [Date by which the compliance must be completed. This should match the 'Date' above.]
                   Legal Provision,in detail, for Non-Compliance: [Specific penalty, fine, or legal consequence outlined in the Act for failing to comply. Include relevant Section number.]
                   Remarks: [Space for additional notes or clarifications regarding the compliance item, e.g., late fee structure, conditions for exemption, relevant circulars, etc.]

       (Repeat for each Act within the Month)
       (Repeat for each Month within the Quarter)
  

Exclude any introductory notes, prefaces,end notes or disclaimers from the output.
 Date format should be 
DD/MM/YYYY
 it should be in the order of the act mention as above     

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
    { value: 'Q1-April to June', label: 'Q1-April to June' },
    { value: 'Q2-July to September', label: 'Q2-July to September' },
    { value: 'Q3-October to December', label: 'Q3-October to December' },
    { value: 'Q4-January to March', label: 'Q4-January to March' },
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

              {/* add a caleder for selecting finiancial end date abd year */}
              <Form.Group className="form-group">
                <Form.Label className="form-label">Last Financial End Date</Form.Label>
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
              <FaSpinner style={{animation: 'spin 1s linear infinite', fontSize: '3rem', color: 'gray' }} />
            </div>
          </Col>
        </Row>
      )}

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
          <h1 className="card-title" style={{marginBottom:'6px'}}> {formData.companyName} -</h1>
          <h2 className="card-title" style={{marginBottom:'12px'}}>Compliance Calendar</h2>
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
                      fileName: `${formData.companyName}-compliance-calendar.pdf` ,
                      title: `Compliance Calendar`
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
                      fileName: `${formData.companyName}-compliance-calendar.docx` ,
                      title: `Compliance Calendar`
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

export default ComplianceCalendar;
