import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaFileWord } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';
import { useActivityTracker, ACTIVITY_TYPES, FEATURES } from '../store/activityTracker';


const SecretarialAudit = () => {
  const { trackActivity } = useActivityTracker();
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: 'Listed Public Company',
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

    const prompt = `
Generate a detailed and professionally structured Secretarial Audit Toolkit for the company named "${formData.companyName}", which is a "${formData.companyType}" under Indian laws.
The toolkit should enable a Company Secretary in Practice (PCS) to conduct a comprehensive Secretarial Audit and prepare the MR-3 report.
Ensure that all compliance items, legal references, and document checks are tailored to the given type of company, and aligned with relevant Indian laws and SEBI regulations (if applicable).
The output must be formatted into the following clearly labeled sections:
 
1. 📘 Guidelines
Provide an overview of the legal scope of secretarial audit for this type of company, covering:
•	Relevant provisions of the Companies Act, 2013
•	SEBI (LODR) Regulations, 2015, if applicable
•	Secretarial Standards (SS-1 and SS-2)
•	Other applicable laws (e.g., FEMA, RBI, IRDAI, CSR Rules)
 
2. 🔧 Preparatory Measures
Actionable steps for the CS before audit begins:
•	Obtaining Board authorisation or engagement letter
•	Review of past audit reports
•	Planning audit calendar
•	Confidentiality agreement and scope fixation
•	Coordination with KMPs and Compliance Officer
 
3. 📑 List of Documents to Verify
A category-wise list of documents to check during audit, including:
•	Notices, agendas, and minutes of meetings (Board, Committee, AGM, EGM)
•	Statutory filings with ROC/MCA (e.g., MGT-7, AOC-4, DIR-12)
•	Internal policies (e.g., Code of Conduct, Whistleblower, RPT policy)
•	Shareholding structure and beneficial ownership
•	Annual Reports and Financial Statements
•	Agreements, contracts, declarations under law
 
4. 🗂 List of Documents to Ask Copies Of
Documents to request soft/hard copies for record or annexure:
•	Resolutions passed
•	Register extracts
•	RPT disclosures
•	DIR-8, MBP-1, CSR reports
•	Audit reports, compliance certificates
•	Website screenshots (mandatory disclosures)
 
5. 📚 Registers and Records to Check
Statutory and non-statutory registers applicable to the company:
•	Register of Members
•	Register of Directors & KMP
•	Register of Charges
•	Register of Contracts (MBP-4)
•	Attendance Registers
•	CSR Register (if applicable)
•	Register of Investments, Loans & Guarantees (Sec. 186)
 
6. 🧾 Other Audit Considerations
Include:
•	Compliance with SEBI (PIT), Depositories Act, IEPF
•	Review of SCORES portal and grievance redressal
•	Verification of website under Reg. 46 of SEBI LODR
•	Evaluation of internal control over secretarial systems
•	Board composition and Independent Director eligibility
•	Proper disclosure of remuneration and KMP appointments
•	Applicability of UDIN on signed MR-3
 
7. 🌱 CSR Audit Checklist (If Applicable)
•	Applicability test under Section 135 (net worth/turnover/profit thresholds)
•	Proper constitution of CSR Committee
•	Adoption and uploading of CSR Policy on website
•	Preparation and execution of Annual Action Plan
•	Amount spent and unspent treatment under Rule 7
•	Filing of Form CSR-2 with MCA
•	Review of impact assessment (if applicable)
•	Bills and records of implementing agency or in-house CSR
•	Schedule VII alignment of CSR projects
 
🎓 Output Standards:
•	Tone and structure must reflect the experience of a senior Company Secretary or solicitor
•	Ensure compliance references are accurate, updated, and professionally worded
•	Keep formatting clean and usable as a working tool for audit execution
•	Tailor all content to the type of company input provided

`;

try {
      await APIService({
        question: prompt,
        onResponse: async (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const generatedContent = data.candidates[0].content.parts[0].text;
            setResponse(generatedContent);
            
            // Track successful generation
            await trackActivity({
              activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
              feature: 'Secretarial Audit',
              action: 'Secretarial Audit Toolkit Generated Successfully',
              inputData: {
                companyName: formData.companyName,
                companyType: formData.companyType
              },
              outputData: {
                success: true,
                content: generatedContent,
                contentLength: generatedContent.length
              },
              metadata: {
                promptLength: prompt.length,
                generationTime: Date.now()
              }
            });
          } else {
            setResponse("Sorry, we couldn't generate a secretarial audit toolkit. Please try again.");
            
            // Track failed generation
            await trackActivity({
              activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
              feature: 'Secretarial Audit',
              action: 'Secretarial Audit Toolkit Generation Failed',
              inputData: {
                companyName: formData.companyName,
                companyType: formData.companyType
              },
              outputData: {
                success: false,
                error: 'No valid response from API'
              },
              metadata: {
                promptLength: prompt.length
              }
            });
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse("An error occurred while generating the secretarial audit toolkit. Please try again later.");
      console.error("Error:", error);
      
      // Track error
      await trackActivity({
        activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
        feature: 'Secretarial Audit',
        action: 'Secretarial Audit Toolkit Generation Error',
        inputData: {
          companyName: formData.companyName,
          companyType: formData.companyType
        },
        outputData: {
          success: false,
          error: error.message
        },
        metadata: {
          promptLength: prompt.length
        }
      });
    }
  };

  // Company type options
  const companyTypes = [
    'Listed Public Company',
    'Unlisted Public Company',
    'Private Limited Company'
  ];

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
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <h1 className="page-title">Secretarial Audit Toolkit</h1>
          <p className="page-description" style={{marginBottom:'16px',textAlign:'center'}}>
          Provision - process - practice- checklist - intimation
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Type</Form.Label>
                <Form.Select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  {companyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <button type="submit" className="features-button" disabled={loading}>
                {loading ? 'Generating Audit Report...' : 'Generate Secretarial Audit Report'}
              </button>
            </Form>
          </Card>
        </Col>
      </Row>

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            <h2 className="card-title" style={{marginBottom:'12px'}}> Checklist for Secretarial Audit - {formData.companyType}</h2>
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
                      fileName: `${formData.companyName}-secretarial-audit.pdf`,
                      title: `Checklist for Secretarial Audit`
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
                      fileName: `${formData.companyName}-secretarial-audit.docx`,
                      title: `Secretarial Audit Report`
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
              </div>
              <AIDisclaimer variant="light" />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SecretarialAudit;
