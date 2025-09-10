import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const StatutoryRegisters = () => {
  const [formData, setFormData] = useState({
    companyType: 'Private Limited Company',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const companyTypes = [
    { value: 'Private Limited Company', label: 'Private Limited Company' },
    { value: 'Listed Public Limited Company', label: 'Listed Public Limited Company' },
    { value: 'Investment Company', label: 'Investment Company' },
    { value: 'Government Company', label: 'Government Company' },
    { value: 'Foreign Company', label: 'Foreign Company' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {

    // let output=handlechangeinPrompt(formData.companyType)
    e.preventDefault();
    setLoading(true);
    setResponse('');
    let prompt=''
    if (formData.companyType==='Private Limited Company'){
      prompt=`
      Generate sectionwise comprehensive list of statutory registers and records for ${formData.companyType} 
      and provision with non-compliance under the Companies Act 2013 as under:

      Format:
      heading - LIST OF STATUTORY REGISTERs AND RECORDS MAINTAIN BY PRIVATE LIMITED COMPANY UNDER COMPANIER ACT 2013
      Output in A,B,C (big and bold)format and in dot points
      Remove the unncessaary notes, disclaimers and suggestions and end note
      `
    }

    else if (formData.companyType==='Listed Public Limited Company'){
      prompt=`
      Generate sectionwise comprehensive list of statutory registers and records for ${formData.companyType} and provision with non-compliance under the Companies Act 2013,
       SEBI act,Companies Rule,Secretarial Standards: SS-1 and SS-2,SEBI LODR, under any other act under Conmapnier Act 2013 as under:

      Format:
      heading - LIST OF STATUTORY REGISTERs AND RECORDS MAINTAIN BY LISTED PUBLIC LIMITED COMPANY UNDER COMPANIER ACT 2013
      Output in A,B,C format and in dot points
      Remove the unncessaary notes, disclaimers and suggestions and end notes.
      `
    }
    else if (formData.companyType==='Investment Company'){
      prompt=`
      Generate sectionwise comprehensive list of statutory registers and records for ${formData.companyType} and provision with non-compliance under theCompanies Act 2013,
       SEBI act,Companies Rule,Secretarial Standards: SS-1 and SS-2,SEBI LODR,RBI act, NBFC rule and act, and under other rules as under:

      Format:
      heading - LIST OF STATUTORY REGISTERs AND RECORDS MAINTAIN BY INVESTMENT COMPANY UNDER COMPANIER ACT 2013
      Output in A,B,C format and in dot points
      Remove the unncessaary notes, disclaimers and suggestions and end notes.
      `
    }
    else if (formData.companyType==='Government Company'){
      prompt=`
      Generate sectionwise comprehensive list of statutory registers and records for ${formData.companyType} and provision with non-compliance under the Companies Act 2013, 
      SEBI act,Companies Rule,Secretarial Standards: SS-1 and SS-2,SEBI LODR, under any other act under Conmapnier Act 2013 ,
      any other act relating to government Companies as under:

      Format:
      heading - LIST OF STATUTORY REGISTERs AND RECORDS MAINTAIN BY INVESTMENT COMPANY UNDER COMPANIER ACT 2013
      Output in A,B,C format and in dot points
      Remove the unncessaary notes, disclaimers and suggestions and end note
      `
    }
    else if (formData.companyType==='Foreign Company'){
      prompt=`
      Generate sectionwise comprehensive list of statutory registers and records for ${formData.companyType} and provision with non-compliance under the Companies Act 2013,
       SEBI act,Companies Rule,Secretarial Standards: SS-1 and SS-2,SEBI LODR, under any other act under Conmapnier Act 2013 ,
      FEMA SEBI act as under:

      Format:
      heading - LIST OF STATUTORY REGISTERs AND RECORDS MAINTAIN BY INVESTMENT COMPANY UNDER COMPANIER ACT 2013
      Output in A,B,C format and in dot points
      Remove the unncessaary notes, disclaimers and suggestions and end note
      `
    }
    // console.log(prompt)

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
      console.error('Error fetching data:', error);
      setResponse('Error: Unable to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const RedStrong = ({ children }) => {
    // Apply Tailwind CSS class 'text-red-500' to make the text red
    return <strong style={{textDecoration: 'underline'}}>{children}</strong>;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <h1 className="page-title">Statutory Registers and Records</h1>
          <p className="page-description">
            Get a comprehensive list of statutory registers and records that must be maintained under the Companies Act 2013 based on company type.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Type of Company</Form.Label>
                <Form.Select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  {companyTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <button type="submit" className="features-button" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="me-2" animation="spin" />
                    Generating List...
                  </>
                ) : (
                  'Generate Statutory Registers List'
                )}
              </button>
            </Form>
          </Card>
        </Col>
      </Row>

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            <h2 className="card-title" style={{marginBottom:'12px'}}>Statutory Registers for {formData.companyType}</h2>
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
                      fileName: `statutory registers and records for ${formData.companyType}.pdf`,
                      title:'Statutory Registers and Records for ' + formData.companyType
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
                      fileName: `statutory registers and records for ${formData.companyType}.docx` ,
                      title:'Statutory Registers and Records for ' + formData.companyType
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  <span className="d-none d-sm-inline">Download Word</span>
                </Button>
              </div>
              <div className="markdown-content">
                <ReactMarkdown
                components={{
                  // Override the default 'strong' component with our custom 'RedStrong' component
                  strong: RedStrong,
                }}
                >{response}</ReactMarkdown>
                <p className="text-center mt-4"><strong>This report is generated by AI</strong></p>
              </div>
              <AIDisclaimer variant="light" />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default StatutoryRegisters;
