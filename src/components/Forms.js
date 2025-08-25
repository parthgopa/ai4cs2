import React, { useState } from 'react';
import { Card, Form, Container, Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaFileAlt } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const Forms = () => {
  const [formData, setFormData] = useState({
    companyName: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    const prompt = `Provide an exhaustive, event-wise list of statutory forms under the Companies Act, 2013 (and relevant Rules), applicable to all types of companies. For each form, include:

Section number (or Rule, where applicable)

Short purpose/provision

Due date (last date for filing)

Consequences of non-compliance

Organise the forms under these categories:

Incorporation & Registration
(e.g. INC-1, INC-2, INC-9, INC-20A, SPICe+ including INC-32 / INC-33 / INC-34)

Annual Filings
(e.g. MGT-7, MGT-7A, AOC-4, AOC-4 CFS, etc.)

Director & KMP-related
(e.g. DIR-3, DIR-5, DIR-6, DIR-3 KYC, etc.)

Charge-related
(e.g. CHG-1, CHG-4, CHG-6, CHG-9, etc.)

Share Capital & Debenture-related
(e.g. PAS-3, SH-7, SH-8, SH-11)

Forms relating to board meeting and general Meeting 

Dormant & Strike-off filings
(e.g. MSC-1, MSC-3, STK-2)

Foreign Company filings
(e.g. FC-1, FC-2, FC-3, FC-4)

Miscellaneous / Event-based
(e.g. MGT-14, DPT-3, CRA-2, GNL-2, MSME-1, etc.)

Any other forms which are very special and rarely to be file like

Forms Related to Board Meetings and Resolutions

MGT-15: This is a report on the Annual General Meeting (AGM) and is required for listed companies. 
MGT-11: This form is a proxy form, given to a member so they can appoint a proxy to attend and vote at a company meeting. 

Forms for Specific Company Types or Events

PAS-4: This form is the private placement offer letter. 

INC-28: This form is for filing a certified copy of a court or Tribunal order. 

INC-24: This form is used for an application to change the company name. 

Forms Related to Special Officers or Activities

DIR-5: This form is for an application to surrender a Director Identification Number (DIN). .

ADJ: This is an application for condonation of delay. 

DIR-11: This is an intimation of resignation by a director.

Base the information primarily on MCA (Ministry of Corporate Affairs) official data

Company Name: ${formData.companyName}`;

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse("Sorry, we couldn't generate the forms list. Please try again.");
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the forms list. Please try again later.");
      console.error("Error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    alert('Content copied to clipboard!');
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Statutory Forms List Generator</h2>
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter company name"
                  required
                />
              </Form.Group>

              <button type="submit" className="features-button" disabled={loading || !formData.companyName.trim()}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Generating Forms List...
                  </>
                ) : (
                  <>
                    <FaFileAlt className="me-2" />
                    Generate Statutory Forms List
                  </>
                )}
              </button>
            </Form>
          </Card>
        </Col>
      </Row>

      {response && (
        <Row className="justify-content-center mt-4">
          <Col md={10}>
            <Card className="output-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="card-title mb-0">Statutory Forms List</h3>
                <div className="export-buttons">
                  <button onClick={copyToClipboard} className="btn btn-outline-primary me-2">
                    <FaCopy className="me-1" /> Copy
                  </button>
                  <button
                    className="btn btn-outline-danger me-2"
                    onClick={() => {
                      const { generatePDF } = PDFGenerator({
                        content: response,
                        fileName: `${formData.companyName}_Statutory_Forms_List.pdf`,
                        title: `Statutory Forms List`
                      });
                      generatePDF();
                    }}
                  >
                    <FaFilePdf className="me-1" /> PDF
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => {
                      const { generateWord } = WordGenerator({
                        content: response,
                        fileName: `${formData.companyName}_Statutory_Forms_List.docx`,
                        title: `Statutory Forms List`
                      });
                      generateWord();
                    }}
                  >
                    <FaFileWord className="me-1" /> Word
                  </button>
                </div>
              </div>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="justify-content-center mt-4">
        <Col md={10}>
          <AIDisclaimer variant="light" />
        </Col>
      </Row>
    </Container>
  );
};

export default Forms;
