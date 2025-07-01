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
5.\tApplicable laws - ${complianceForString} 
6.\tCalendar type- detailed

Task: Generate a Statutory Compliance Calendar for  ${formData.companyName} ${formData.companyType} 
for the ${formData.quarterlyOptions.join(', ')} quarter following the financial year ending ${formData.financialEndDate}. 
Exclude any introductory notes,end note, prefaces, or disclaimers, warnings through the output( like (Note: This calendar is a simplified representation and may not cover all compliance requirements. Professional advice should be sought for comprehensive compliance.)).
The calendar should be organized as follows( in "dot points"): 

  1.  Quarter: [Selected Quarter] (e.g., Q1)
    2.  Months within the Quarter: (e.g., April, May, June)
           Act: [Name of the Act, e.g., Companies Act 2013]
               Date: [Specific Date for Compliance]
                   Compliance Item: [Specific description of the compliance requirement, e.g., Filing of Form XYZ, Payment of TDS, etc.]
                   Governing Act & Section: [Specify the Act and Section number from which the compliance item originates.]
                   Applicable Form (if any): [Name of the form required for compliance, e.g., Form GSTR-3B, Form ITR-6, etc.]
                   Due Date: [Date by which the compliance must be completed. This should match the 'Date' above.]
                   Legal Provision for Non-Compliance: [Specific penalty, fine, or legal consequence outlined in the Act for failing to comply. Include relevant Section number.]
                   Remarks: [Space for additional notes or clarifications regarding the compliance item, e.g., late fee structure, conditions for exemption, relevant circulars, etc.]

       (Repeat for each Act within the Month)
       (Repeat for each Month within the Quarter)
  
(Example structure - you will fill in the details):
w
### Quarter: Q1
#### Months within the Quarter: April, May, June

---

#### Month: April

* *Act: Companies Act, 2013*
    * *Date: 30/04/2024*
        * Compliance Item: Filing of Form MSME I (Half Yearly Return) for October 2023 to March 2024
        * Governing Act & Section: Companies Act, 2013, Section 405 read with Rule 5 of Companies (Furnishing of Information about Payment to Micro and Small Enterprise Suppliers) Rules, 2019
        * Applicable Form (if any): MSME I
        * Due Date: 30/04/2024
        * Legal Provision for Non-Compliance: Penalty as per Section 450 of Companies Act, 2013.
        * Remarks: Applicable if the company has outstanding payments to Micro and Small Enterprise suppliers for more than 45 days.

* *Act: Income Tax Act*
    * *Date: 07/04/2024*
        * Compliance Item: Due date for deposit of TDS/TCS for the month of March 2024
        * Governing Act & Section: Income Tax Act, 1961
        * Applicable Form (if any): ITNS 281
        * Due Date: 07/04/2024
        * Legal Provision for Non-Compliance: Interest under Section 201(1A) for delay in payment.
        * Remarks: This applies to all tax deducted/collected at source.
    * *Date: 30/04/2024*
        * Compliance Item: Furnishing of TDS certificate (Form 16A) for the quarter ending 31st March 2024 for other than salary.
        * Governing Act & Section: Income Tax Act, 1961, Section 203
        * Applicable Form (if any): Form 16A
        * Due Date: 30/04/2024
        * Legal Provision for Non-Compliance: Penalty of INR 100 per day for default under Section 272A(2)(g).
        * Remarks: To be issued to the deductees.
    * *Date: 30/04/2024*
        * Compliance Item: Furnishing of Quarterly TDS statement (Form 24Q/26Q/27Q) for the quarter ending 31st March 2024.
        * Governing Act & Section: Income Tax Act, 1961, Section 200(3)
        * Applicable Form (if any): Form 24Q/26Q/27Q
        * Due Date: 30/04/2024
        * Legal Provision for Non-Compliance: Late fee under Section 234E of INR 200 per day till the default continues, subject to the amount of TDS.
        * Remarks: Includes details of tax deducted on salary and non-salary payments.


(Continue in the same format for May, June, and other relevant Acts and dates)
Exclude any introductory notes, prefaces, or disclaimers from the output.
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
              </Form.Group>  */}

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
                      fileName: `${formData.companyName}-compliance-calendar.pdf` 
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
                      fileName: `${formData.companyName}-compliance-calendar.docx` 
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
