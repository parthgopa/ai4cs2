import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button, Nav, Alert, ProgressBar } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaEnvelope, FaArrowRight, FaArrowLeft, FaCheck, FaReply, FaListAlt, FaFileAlt, FaCalendarAlt, FaDownload, FaUpload, FaImage, FaFile, FaEye } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';
import { useActivityTracker, ACTIVITY_TYPES, FEATURES } from '../store/activityTracker';

const EmailDrafter = () => {
  const { trackActivity } = useActivityTracker();
  // Primary mode state - controls entire UI
  const [mode, setMode] = useState('New Email');
  
  // New Email mode states (preserving existing functionality)
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Content
    connotation: '',
    subject: '',
    inputDetails: '',
    otherPoints: '',
    // Step 2 - Output Preferences
    language: '',
    tone: '',
    references: '',
    length: '',
    closingConnotation: '',
    signatory: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Reply mode states
  const [replyData, setReplyData] = useState({
    originalEmail: '',
    replyTone: '',
    replyObjective: '',
    uploadMethod: 'text' // 'text' or 'file'
  });
  
  // File processing states
  const [fileProcessing, setFileProcessing] = useState({
    isProcessing: false,
    progress: 0,
    status: '',
    error: null
  });
  
  // Summarize mode states
  const [summarizeData, setSummarizeData] = useState({
    textToSummarize: '',
    uploadMethod: 'text' // 'text' or 'file'
  });
  
  // Template mode states
  const [templateData, setTemplateData] = useState({
    selectedTemplate: '',
    templateInputs: {}
  });
  
  // Schedule mode states
  const [scheduleData, setScheduleData] = useState({
    subject: '',
    date: '',
    time: '',
    agenda: ''
  });
  
  // Common states
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Mode configuration
  const modes = [
    { key: 'New Email', label: 'New Email', icon: <FaEnvelope /> },
    { key: 'Reply', label: 'Reply', icon: <FaReply /> },
    { key: 'Summarize', label: 'Summarize', icon: <FaListAlt /> },
    { key: 'Template', label: 'Template', icon: <FaFileAlt /> },
    { key: 'Schedule', label: 'Schedule', icon: <FaCalendarAlt /> }
  ];

  // Predefined templates
  const emailTemplates = [
    { value: '', label: 'Select a template...' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'meeting-request', label: 'Meeting Request' },
    { value: 'invoice-reminder', label: 'Invoice Reminder' },
    { value: 'thank-you', label: 'Thank You' },
    { value: 'introduction', label: 'Introduction' },
    { value: 'apology', label: 'Apology' },
    { value: 'confirmation', label: 'Confirmation' },
    { value: 'invitation', label: 'Invitation' }
  ];

  const step1Fields = [
    {
      field: 'connotation',
      label: 'Connotation',
      type: 'select',
      options: [
        { value: '', label: 'Select connotation...' },
        { value: 'Sir', label: 'Sir' },
        { value: 'Dear Sir', label: 'Dear Sir' },
        { value: 'Madam', label: 'Madam' },
        { value: 'Dear Madam', label: 'Dear Madam' },
        { value: 'Dear Sir/Madam', label: 'Dear Sir/Madam' },
        { value: 'Respected Sir', label: 'Respected Sir' },
        { value: 'Respected Madam', label: 'Respected Madam' },
        { value: 'Dear Mr.', label: 'Dear Mr.' },
        { value: 'Dear Ms.', label: 'Dear Ms.' }
      ]
    },
    {
      field: 'subject',
      label: 'Subject of the email',
      type: 'text',
      placeholder: 'Enter the subject line for your email'
    },
    {
      field: 'inputDetails',
      label: 'Input details (brief context / purpose)',
      type: 'textarea',
      placeholder: 'Provide brief context or purpose of the email'
    },
    {
      field: 'otherPoints',
      label: 'Any other points to cover',
      type: 'textarea',
      placeholder: 'Any additional points you want to include (optional)',
      optional: true
    }
  ];

  const step2Fields = [
    {
      field: 'language',
      label: 'Language',
      type: 'select',
      options: [
        { value: '', label: 'Select language...' },
        { value: 'English', label: 'English' },
        { value: 'Hindi', label: 'Hindi' },
        { value: 'Gujarati', label: 'Gujarati' }
      ]
    },
    {
      field: 'tone',
      label: 'Tone',
      type: 'select',
      options: [
        { value: '', label: 'Select tone...' },
        { value: 'Simple', label: 'Simple' },
        { value: 'Professional', label: 'Professional' },
        { value: 'Legal', label: 'Legal' },
        { value: 'Requesting', label: 'Requesting' }
      ]
    },
    {
      field: 'references',
      label: 'References or case law',
      type: 'select',
      options: [
        { value: '', label: 'Select...' },
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
      ]
    },
    {
      field: 'length',
      label: 'Length',
      type: 'select',
      options: [
        { value: '', label: 'Select length...' },
        { value: 'Summary', label: 'Summary' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Detailed', label: 'Detailed' }
      ]
    },
    {
      field: 'closingConnotation',
      label: 'Closing connotation',
      type: 'select',
      options: [
        { value: '', label: 'Select closing...' },
        { value: 'With regards', label: 'With regards' },
        { value: 'Yours faithfully', label: 'Yours faithfully' },
        { value: 'Yours sincerely', label: 'Yours sincerely' },
        { value: 'Best regards', label: 'Best regards' },
        { value: 'Warm regards', label: 'Warm regards' },
        { value: 'Respectfully yours', label: 'Respectfully yours' },
        { value: 'Thank you', label: 'Thank you' }
      ]
    },
    {
      field: 'signatory',
      label: 'Signatory (Sender\'s name + position)',
      type: 'text',
      placeholder: 'e.g., John Doe, Company Secretary'
    }
  ];

  // Handler functions for different modes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleReplyInputChange = (e) => {
    const { name, value } = e.target;
    setReplyData({
      ...replyData,
      [name]: value
    });
  };

  const handleSummarizeInputChange = (e) => {
    const { name, value } = e.target;
    setSummarizeData({
      ...summarizeData,
      [name]: value
    });
  };

  const handleTemplateInputChange = (e) => {
    const { name, value } = e.target;
    setTemplateData({
      ...templateData,
      [name]: value
    });
  };

  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
      ...scheduleData,
      [name]: value
    });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setResponse('');
    setLoading(false);
    // Reset current step for New Email mode
    if (newMode === 'New Email') {
      setCurrentStep(1);
      setShowConfirmation(false);
    }
    // Reset file processing state when changing modes
    setFileProcessing({
      isProcessing: false,
      progress: 0,
      status: '',
      error: null
    });
  };

  // File processing functions
  const processTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  };

  const processPDFFile = async (file) => {
    try {
      // For now, we'll use a simple approach - in a real implementation, 
      // you would need to install pdfjs-dist: npm install pdfjs-dist
      const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
      
      // Set worker source (you'll need to copy this to public folder)
      GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      throw new Error('PDF processing failed. Please try copying and pasting the text manually.');
    }
  };

  const processImageFile = async (file) => {
    try {
      // For OCR, we would use Tesseract.js
      // You would need to install: npm install tesseract.js
      const { createWorker } = await import('tesseract.js');
      
      const worker = await createWorker({
        logger: m => {
          if (m.status === 'recognizing text') {
            setFileProcessing(prev => ({
              ...prev,
              progress: Math.round(m.progress * 100),
              status: 'Recognizing text...'
            }));
          }
        }
      });
      
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      return text;
    } catch (error) {
      throw new Error('OCR processing failed. Please try a clearer image or paste text manually.');
    }
  };

  const processWordFile = async (file) => {
    try {
      // For DOCX files, we would use mammoth
      // You would need to install: npm install mammoth
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      throw new Error('Word document processing failed. Please try copying and pasting the text manually.');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileProcessing({
      isProcessing: true,
      progress: 0,
      status: 'Processing file...',
      error: null
    });

    try {
      let extractedText = '';
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        setFileProcessing(prev => ({ ...prev, status: 'Reading text file...' }));
        extractedText = await processTextFile(file);
      } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        setFileProcessing(prev => ({ ...prev, status: 'Extracting text from PDF...' }));
        extractedText = await processPDFFile(file);
      } else if (fileType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
        setFileProcessing(prev => ({ ...prev, status: 'Running OCR on image...' }));
        extractedText = await processImageFile(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        setFileProcessing(prev => ({ ...prev, status: 'Extracting text from Word document...' }));
        extractedText = await processWordFile(file);
      } else {
        throw new Error('Unsupported file type. Please use TXT, PDF, DOCX, or image files.');
      }

      // Update the original email field with extracted text
      setReplyData(prev => ({
        ...prev,
        originalEmail: extractedText.trim()
      }));

      setFileProcessing({
        isProcessing: false,
        progress: 100,
        status: 'File processed successfully!',
        error: null
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setFileProcessing(prev => ({ ...prev, status: '' }));
      }, 3000);

    } catch (error) {
      setFileProcessing({
        isProcessing: false,
        progress: 0,
        status: '',
        error: error.message
      });
    }
  };

  const handleSummarizeFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileProcessing({
      isProcessing: true,
      progress: 0,
      status: 'Processing file...',
      error: null
    });

    try {
      let extractedText = '';
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        setFileProcessing(prev => ({ ...prev, status: 'Reading text file...' }));
        extractedText = await processTextFile(file);
      } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        setFileProcessing(prev => ({ ...prev, status: 'Extracting text from PDF...' }));
        extractedText = await processPDFFile(file);
      } else if (fileType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
        setFileProcessing(prev => ({ ...prev, status: 'Running OCR on image...' }));
        extractedText = await processImageFile(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        setFileProcessing(prev => ({ ...prev, status: 'Extracting text from Word document...' }));
        extractedText = await processWordFile(file);
      } else {
        throw new Error('Unsupported file type. Please use TXT, PDF, DOCX, or image files.');
      }

      // Update the text to summarize field with extracted text
      setSummarizeData(prev => ({
        ...prev,
        textToSummarize: extractedText.trim()
      }));

      setFileProcessing({
        isProcessing: false,
        progress: 100,
        status: 'File processed successfully!',
        error: null
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setFileProcessing(prev => ({ ...prev, status: '' }));
      }, 3000);

    } catch (error) {
      setFileProcessing({
        isProcessing: false,
        progress: 0,
        status: '',
        error: error.message
      });
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate Step 1 required fields
      const requiredStep1Fields = step1Fields.filter(field => !field.optional);
      const missingFields = requiredStep1Fields.filter(field => !formData[field.field]);
      
      if (missingFields.length > 0) {
        alert('Please fill in all required fields before proceeding.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate Step 2 required fields
      const missingFields = step2Fields.filter(field => !formData[field.field]);
      
      if (missingFields.length > 0) {
        alert('Please fill in all required fields before proceeding.');
        return;
      }
      setShowConfirmation(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    generateEmail();
  };

  const handleEdit = (step) => {
    setCurrentStep(step);
    setShowConfirmation(false);
  };

  // Generation functions for different modes
  const generateEmail = async () => {
    setLoading(true);
    setResponse('');

    // Get current date
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const prompt = `You are my Email Writing Assistant.

Your task is to draft a professional email based on the following inputs:

**Content Details:**
- Connotation: ${formData.connotation}
- Subject: ${formData.subject}
- Context/Purpose: ${formData.inputDetails}
- Additional Points: ${formData.otherPoints || 'None'}

**Output Preferences:**
- Language: ${formData.language}
- Tone: ${formData.tone}
- Include References/Case Law: ${formData.references}
- Length: ${formData.length}
- Closing: ${formData.closingConnotation}
- Signatory: ${formData.signatory}

**Instructions:**
1. Auto-insert today's date (${currentDate}) at top-right of the email
2. Show Subject line on top
3. Write the body in short paragraphs (1–3 sentences each)
4. End with closing connotation + signatory
5. Keep formatting clean and copy-paste ready (Note format)
6. Use ${formData.tone.toLowerCase()} tone throughout
7. Write in ${formData.language}
8. ${formData.references === 'Yes' ? 'Include relevant legal references or case laws where applicable' : 'Do not include legal references or case laws'}
9. Make it ${formData.length.toLowerCase()} in length

Format the email professionally with proper spacing and structure. Make it ready for immediate use.

Remove all introductory paragraph, end notes and any other non-relevant content.`;

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
              feature: FEATURES.EMAIL_DRAFTER,
              action: 'Email drafted successfully',
              inputData: {
                connotation: formData.connotation,
                subject: formData.subject,
                language: formData.language,
                tone: formData.tone,
                length: formData.length,
                signatory: formData.signatory
              },
              outputData: {
                success: true,
                content: generatedContent,
                contentLength: generatedContent.length
              },
              metadata: {
                promptLength: prompt.length,
                generationTime: new Date().toISOString(),
                currentStep: currentStep,
                mode: mode
              }
            });
          } else {
            const errorMessage = "Sorry, we couldn't generate the email. Please try again.";
            setResponse(errorMessage);
            
            // Track failed generation
            await trackActivity({
              activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
              feature: FEATURES.EMAIL_DRAFTER,
              action: 'Failed to draft email',
              inputData: {
                connotation: formData.connotation,
                subject: formData.subject,
                language: formData.language,
                tone: formData.tone
              },
              outputData: {
                success: false,
                error: 'No valid response from API'
              },
              metadata: {
                promptLength: prompt.length,
                generationTime: new Date().toISOString(),
                currentStep: currentStep,
                mode: mode
              }
            });
          }
        }
      });
    } catch (error) {
      setLoading(false);
      const errorMessage = "An error occurred while generating the email. Please try again later.";
      setResponse(errorMessage);
      console.error("Error:", error);
      
      // Track error
      await trackActivity({
        activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
        feature: FEATURES.EMAIL_DRAFTER,
        action: 'Error in drafting email',
        inputData: {
          connotation: formData.connotation,
          subject: formData.subject,
          language: formData.language,
          tone: formData.tone
        },
        outputData: {
          success: false,
          error: error.message || 'API call failed'
        },
        metadata: {
          promptLength: prompt.length,
          generationTime: new Date().toISOString(),
          currentStep: currentStep,
          mode: mode
        }
      });
    }
  };

  const generateReply = async () => {
    if (!replyData.originalEmail || !replyData.replyTone || !replyData.replyObjective) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setResponse('');

    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const prompt = `You are my Email Reply Assistant.

**Original Email:**
${replyData.originalEmail}

**Reply Requirements:**
- Tone: ${replyData.replyTone}
- Objective: ${replyData.replyObjective}

**Instructions:**
1. Auto-insert today's date (${currentDate}) at top-right
2. Generate an appropriate subject line (Re: original subject)
3. Write a professional reply with ${replyData.replyTone.toLowerCase()} tone
4. Address the ${replyData.replyObjective.toLowerCase()} objective
5. Keep formatting clean and copy-paste ready
6. Include appropriate greeting and closing

Format the reply professionally with proper spacing and structure.

Remove all introductory paragraph, end notes and any other non-relevant content.`;

    try {
      await APIService({
        question: prompt,
        onResponse: async (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const generatedContent = data.candidates[0].content.parts[0].text;
            setResponse(generatedContent);
            
            // Track successful reply generation
            await trackActivity({
              activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
              feature: FEATURES.EMAIL_DRAFTER,
              action: 'Email reply generated successfully',
              inputData: {
                originalEmail: replyData.originalEmail,
                replyTone: replyData.replyTone,
                replyObjective: replyData.replyObjective
              },
              outputData: {
                success: true,
                content: generatedContent,
                contentLength: generatedContent.length
              },
              metadata: {
                promptLength: prompt.length,
                generationTime: new Date().toISOString(),
                mode: 'Reply Email'
              }
            });
          } else {
            const errorMessage = "Sorry, we couldn't generate the reply. Please try again.";
            setResponse(errorMessage);
            
            // Track failed reply generation
            await trackActivity({
              activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
              feature: FEATURES.EMAIL_DRAFTER,
              action: 'Failed to generate email reply',
              inputData: {
                replyTone: replyData.replyTone,
                replyObjective: replyData.replyObjective
              },
              outputData: {
                success: false,
                error: 'No valid response from API'
              },
              metadata: {
                promptLength: prompt.length,
                generationTime: new Date().toISOString(),
                mode: 'Reply Email'
              }
            });
          }
        }
      });
    } catch (error) {
      setLoading(false);
      const errorMessage = "An error occurred while generating the reply. Please try again later.";
      setResponse(errorMessage);
      console.error("Error:", error);
      
      // Track reply generation error
      await trackActivity({
        activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
        feature: FEATURES.EMAIL_DRAFTER,
        action: 'Error in generating email reply',
        inputData: {
          replyTone: replyData.replyTone,
          replyObjective: replyData.replyObjective
        },
        outputData: {
          success: false,
          error: error.message || 'API call failed'
        },
        metadata: {
          promptLength: prompt.length,
          generationTime: new Date().toISOString(),
          mode: 'Reply Email'
        }
      });
    }
  };

  const generateSummary = async () => {
    if (!summarizeData.textToSummarize) {
      alert('Please provide text to summarize.');
      return;
    }

    setLoading(true);
    setResponse('');

    const prompt = `You are my Text Summarization Assistant.

**Text to Summarize:**
${summarizeData.textToSummarize}

**Instructions:**
1. Provide a concise summary of the main points
2. Create a list of action items (if any)
3. Highlight key decisions or important information
4. Use bullet points for clarity
5. Keep it professional and structured

**Format:**
## Summary
[Concise summary of main points]

## Action Items
[List of actionable items, if any]

## Key Points
[Important highlights or decisions]

Remove all introductory paragraph, end notes and any other non-relevant content.`;

    try {
      await APIService({
        question: prompt,
        onResponse: async (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const generatedContent = data.candidates[0].content.parts[0].text;
            setResponse(generatedContent);
            
            // Track successful summary generation
            await trackActivity({
              activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
              feature: FEATURES.EMAIL_DRAFTER,
              action: 'Email summary generated successfully',
              inputData: {
                textToSummarize: summarizeData.textToSummarize,
                summaryType: summarizeData.summaryType
              },
              outputData: {
                success: true,
                content: generatedContent,
                contentLength: generatedContent.length
              },
              metadata: {
                promptLength: prompt.length,
                generationTime: new Date().toISOString(),
                mode: 'Summarize Email'
              }
            });
          } else {
            const errorMessage = "Sorry, we couldn't generate the summary. Please try again.";
            setResponse(errorMessage);
            
            // Track failed summary generation
            await trackActivity({
              activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
              feature: FEATURES.EMAIL_DRAFTER,
              action: 'Failed to generate email summary',
              inputData: {
                summaryType: summarizeData.summaryType
              },
              outputData: {
                success: false,
                error: 'No valid response from API'
              },
              metadata: {
                promptLength: prompt.length,
                generationTime: new Date().toISOString(),
                mode: 'Summarize Email'
              }
            });
          }
        }
      });
    } catch (error) {
      setLoading(false);
      const errorMessage = "An error occurred while generating the summary. Please try again later.";
      setResponse(errorMessage);
      console.error("Error:", error);
      
      // Track summary generation error
      await trackActivity({
        activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
        feature: FEATURES.EMAIL_DRAFTER,
        action: 'Error in generating email summary',
        inputData: {
          summaryType: summarizeData.summaryType
        },
        outputData: {
          success: false,
          error: error.message || 'API call failed'
        },
        metadata: {
          promptLength: prompt.length,
          generationTime: new Date().toISOString(),
          mode: 'Summarize Email'
        }
      });
    }
  };

  const generateFromTemplate = async () => {
    if (!templateData.selectedTemplate) {
      alert('Please select a template.');
      return;
    }

    setLoading(true);
    setResponse('');

    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const prompt = `You are my Email Template Assistant.

Template Type: ${templateData.selectedTemplate}

Instructions:
1. Generate a professional ${templateData.selectedTemplate} email template
2. Auto-insert today's date (${currentDate}) at top-right
3. Include placeholder fields that users can customize (e.g., [Recipient Name], [Company Name], etc.)
4. Use professional language and appropriate tone for ${templateData.selectedTemplate}
5. Keep formatting clean and copy-paste ready
6. Include proper email structure with subject line, greeting, body, and closing

Format the template professionally with clear placeholders for customization.

Remove all introductory paragraph, end notes and any other non-relevant content.`;

    try {
      await APIService({
        question: prompt,
        onResponse: async (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const generatedContent = data.candidates[0].content.parts[0].text;
            setResponse(generatedContent);
            
            // Track successful template generation
            await trackActivity({
              activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
              feature: FEATURES.EMAIL_DRAFTER,
              action: 'Email template generated successfully',
              inputData: {
                selectedTemplate: templateData.selectedTemplate
              },
              outputData: {
                success: true,
                content: generatedContent,
                contentLength: generatedContent.length
              },
              metadata: {
                promptLength: prompt.length,
                generationTime: new Date().toISOString(),
                mode: 'Template Generator'
              }
            });
          } else {
            const errorMessage = "Sorry, we couldn't generate the template. Please try again.";
            setResponse(errorMessage);
            
            // Track failed template generation
            await trackActivity({
              activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
              feature: FEATURES.EMAIL_DRAFTER,
              action: 'Failed to generate email template',
              inputData: {
                selectedTemplate: templateData.selectedTemplate
              },
              outputData: {
                success: false,
                error: 'No valid response from API'
              },
              metadata: {
                promptLength: prompt.length,
                generationTime: new Date().toISOString(),
                mode: 'Template Generator'
              }
            });
          }
        }
      });
    } catch (error) {
      setLoading(false);
      const errorMessage = "An error occurred while generating the template. Please try again later.";
      setResponse(errorMessage);
      console.error("Error:", error);
      
      // Track template generation error
      await trackActivity({
        activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
        feature: FEATURES.EMAIL_DRAFTER,
        action: 'Error in generating email template',
        inputData: {
          selectedTemplate: templateData.selectedTemplate
        },
        outputData: {
          success: false,
          error: error.message || 'API call failed'
        },
        metadata: {
          promptLength: prompt.length,
          generationTime: new Date().toISOString(),
          mode: 'Template Generator'
        }
      });
    }
  };

  const generateCalendarFile = () => {
    if (!scheduleData.subject || !scheduleData.date || !scheduleData.time) {
      alert('Please fill in all required fields (Subject, Date, Time).');
      return;
    }

    // Create ICS file content
    const startDateTime = new Date(`${scheduleData.date}T${scheduleData.time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EmailDrafter//EN
BEGIN:VEVENT
UID:${Date.now()}@emaildrafter.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDateTime)}
DTEND:${formatDate(endDateTime)}
SUMMARY:${scheduleData.subject}
DESCRIPTION:${scheduleData.agenda || 'Meeting scheduled via Email Drafter'}
END:VEVENT
END:VCALENDAR`;

    // Create and download the file
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${scheduleData.subject.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert('Calendar file downloaded successfully!');
  };

  const resetForm = () => {
    // Reset based on current mode
    if (mode === 'New Email') {
      setCurrentStep(1);
      setFormData({
        connotation: '',
        subject: '',
        inputDetails: '',
        otherPoints: '',
        language: '',
        tone: '',
        references: '',
        length: '',
        closingConnotation: '',
        signatory: ''
      });
      setShowConfirmation(false);
    } else if (mode === 'Reply') {
      setReplyData({
        originalEmail: '',
        replyTone: '',
        replyObjective: '',
        uploadMethod: 'text'
      });
      setFileProcessing({
        isProcessing: false,
        progress: 0,
        status: '',
        error: null
      });
    } else if (mode === 'Summarize') {
      setSummarizeData({
        textToSummarize: '',
        uploadMethod: 'text'
      });
      setFileProcessing({
        isProcessing: false,
        progress: 0,
        status: '',
        error: null
      });
    } else if (mode === 'Template') {
      setTemplateData({
        selectedTemplate: '',
        templateInputs: {}
      });
    } else if (mode === 'Schedule') {
      setScheduleData({
        subject: '',
        date: '',
        time: '',
        agenda: ''
      });
    }
    setResponse('');
    setLoading(false);
  };

  // Render mode-specific content
  const renderModeContent = () => {
    if (loading) {
      return (
        <Card className="input-card">
          <div className="text-center">
            <FaSpinner className="spinner me-2" style={{ fontSize: '2rem' }} />
            <h3>Processing...</h3>
            <p>Please wait while we process your request.</p>
          </div>
        </Card>
      );
    }

    switch (mode) {
      case 'New Email':
        return renderNewEmailMode();
      case 'Reply':
        return renderReplyMode();
      case 'Summarize':
        return renderSummarizeMode();
      case 'Template':
        return renderTemplateMode();
      case 'Schedule':
        return renderScheduleMode();
      default:
        return renderNewEmailMode();
    }
  };

  // Render functions for each mode
  const renderNewEmailMode = () => {
    if (showConfirmation) {
      return (
        <Card className="input-card">
          <h2 className="card-title">Confirm Email Details</h2>
          <div className="mb-4">
            <p>Please review your email details:</p>
            
            <h5 className="mt-4 mb-3">Content Details:</h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="mb-2">
                <strong>Connotation:</strong> {formData.connotation}
                <Button variant="link" size="sm" onClick={() => handleEdit(1)} className="ms-2">Edit</Button>
              </li>
              <li className="mb-2">
                <strong>Subject:</strong> {formData.subject}
                <Button variant="link" size="sm" onClick={() => handleEdit(1)} className="ms-2">Edit</Button>
              </li>
              <li className="mb-2">
                <strong>Context/Purpose:</strong> {formData.inputDetails}
                <Button variant="link" size="sm" onClick={() => handleEdit(1)} className="ms-2">Edit</Button>
              </li>
              {formData.otherPoints && (
                <li className="mb-2">
                  <strong>Additional Points:</strong> {formData.otherPoints}
                  <Button variant="link" size="sm" onClick={() => handleEdit(1)} className="ms-2">Edit</Button>
                </li>
              )}
            </ul>

            <h5 className="mt-4 mb-3">Output Preferences:</h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="mb-2">
                <strong>Language:</strong> {formData.language}
                <Button variant="link" size="sm" onClick={() => handleEdit(2)} className="ms-2">Edit</Button>
              </li>
              <li className="mb-2">
                <strong>Tone:</strong> {formData.tone}
                <Button variant="link" size="sm" onClick={() => handleEdit(2)} className="ms-2">Edit</Button>
              </li>
              <li className="mb-2">
                <strong>References:</strong> {formData.references}
                <Button variant="link" size="sm" onClick={() => handleEdit(2)} className="ms-2">Edit</Button>
              </li>
              <li className="mb-2">
                <strong>Length:</strong> {formData.length}
                <Button variant="link" size="sm" onClick={() => handleEdit(2)} className="ms-2">Edit</Button>
              </li>
              <li className="mb-2">
                <strong>Closing:</strong> {formData.closingConnotation}
                <Button variant="link" size="sm" onClick={() => handleEdit(2)} className="ms-2">Edit</Button>
              </li>
              <li className="mb-2">
                <strong>Signatory:</strong> {formData.signatory}
                <Button variant="link" size="sm" onClick={() => handleEdit(2)} className="ms-2">Edit</Button>
              </li>
            </ul>
          </div>
          <p><strong>Do you confirm these details for email drafting?</strong></p>
          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={() => setShowConfirmation(false)}>
              <FaArrowLeft className="me-1" />
              Back to Edit
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              <FaCheck className="me-1" />
              Yes, Draft Email
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <Card className="input-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">New Email</h3>
          <span className="badge bg-primary">Step {currentStep} of 2</span>
        </div>
        
        <div className="progress mb-4">
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ width: `${(currentStep / 2) * 100}%` }}
            aria-valuenow={currentStep} 
            aria-valuemin="0" 
            aria-valuemax="2"
          ></div>
        </div>

        <p className="text-muted mb-4">
          {currentStep === 1 ? 'Provide the content details for your email' : 'Set your output preferences'}
        </p>

        <Form>
          {currentStep === 1 && (
            <>
              <h5 className="mb-3">Content Details</h5>
              {step1Fields.map((field, index) => (
                <Form.Group key={field.field} className="form-group">
                  <Form.Label className="form-label">
                    {field.label}
                    {field.optional && <span className="text-muted"> (Optional)</span>}
                  </Form.Label>
                  
                  {field.type === 'text' ? (
                    <Form.Control
                      type="text"
                      name={field.field}
                      value={formData[field.field]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="form-control"
                      autoFocus={index === 0}
                    />
                  ) : field.type === 'textarea' ? (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name={field.field}
                      value={formData[field.field]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="form-control"
                    />
                  ) : (
                    <Form.Select
                      name={field.field}
                      value={formData[field.field]}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>
              ))}
            </>
          )}

          {currentStep === 2 && (
            <>
              <h5 className="mb-3">Output Preferences</h5>
              {step2Fields.map((field, index) => (
                <Form.Group key={field.field} className="form-group">
                  <Form.Label className="form-label">{field.label}</Form.Label>
                  
                  {field.type === 'text' ? (
                    <Form.Control
                      type="text"
                      name={field.field}
                      value={formData[field.field]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="form-control"
                      autoFocus={index === 0}
                    />
                  ) : (
                    <Form.Select
                      name={field.field}
                      value={formData[field.field]}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>
              ))}
            </>
          )}

          <div className="d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <FaArrowLeft className="me-1" />
              Previous
            </Button>
            
            <Button 
              className="features-button"
              onClick={handleNext}
            >
              {currentStep === 2 ? (
                <>
                  <FaEnvelope className="me-1" />
                  Review & Confirm
                </>
              ) : (
                <>
                  Next
                  <FaArrowRight className="ms-1" />
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card>
    );
  };

  const renderReplyMode = () => (
    <Card className="input-card">
      <h3 className="mb-4">Reply to Email</h3>
      <Form>
        {/* Input Method Selection */}
        <Form.Group className="form-group">
          <Form.Label className="form-label">How would you like to provide the original email?</Form.Label>
          <div className="d-flex gap-3 mb-3">
            <Form.Check
              type="radio"
              id="text-input"
              name="uploadMethod"
              value="text"
              checked={replyData.uploadMethod === 'text'}
              onChange={handleReplyInputChange}
              label={
                <span className="d-flex align-items-center">
                  <FaFile className="me-2" />
                  Type/Paste Text
                </span>
              }
            />
            <Form.Check
              type="radio"
              id="file-upload"
              name="uploadMethod"
              value="file"
              checked={replyData.uploadMethod === 'file'}
              onChange={handleReplyInputChange}
              label={
                <span className="d-flex align-items-center">
                  <FaUpload className="me-2" />
                  Upload File
                </span>
              }
            />
          </div>
        </Form.Group>

        {/* Text Input Method */}
        {replyData.uploadMethod === 'text' && (
          <Form.Group className="form-group">
            <Form.Label className="form-label">Original Email</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              name="originalEmail"
              value={replyData.originalEmail}
              onChange={handleReplyInputChange}
              placeholder="Paste the original email here..."
              className="form-control"
            />
          </Form.Group>
        )}

        {/* File Upload Method */}
        {replyData.uploadMethod === 'file' && (
          <Form.Group className="form-group">
            <Form.Label className="form-label">Upload File</Form.Label>
            <div className="mb-3">
              <Alert variant="info" className="small">
                <strong>Supported formats:</strong>
                <ul className="mb-0 mt-2">
                  <li><FaImage className="me-1" /> Images (JPG, PNG, GIF, BMP, WebP) - OCR text extraction</li>
                  <li><FaFilePdf className="me-1" /> PDF files - Text extraction</li>
                  <li><FaFileWord className="me-1" /> Word documents (.docx) - Text extraction</li>
                  <li><FaFile className="me-1" /> Text files (.txt) - Direct reading</li>
                </ul>
              </Alert>
            </div>
            
            <Form.Control
              type="file"
              accept=".txt,.pdf,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
              onChange={handleFileUpload}
              className="form-control"
              disabled={fileProcessing.isProcessing}
            />
            
            {/* File Processing Status */}
            {fileProcessing.isProcessing && (
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">{fileProcessing.status}</small>
                  <small className="text-muted">{fileProcessing.progress}%</small>
                </div>
                <ProgressBar now={fileProcessing.progress} animated />
              </div>
            )}
            
            {fileProcessing.status && !fileProcessing.isProcessing && !fileProcessing.error && (
              <Alert variant="success" className="mt-3 small">
                <FaCheck className="me-1" />
                {fileProcessing.status}
              </Alert>
            )}
            
            {fileProcessing.error && (
              <Alert variant="danger" className="mt-3 small">
                <strong>Error:</strong> {fileProcessing.error}
              </Alert>
            )}
            
            {/* Extracted Text Preview */}
            {replyData.originalEmail && replyData.uploadMethod === 'file' && (
              <Form.Group className="form-group mt-3">
                <Form.Label className="form-label">
                  <FaEye className="me-1" />
                  Extracted Text (You can edit if needed)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="originalEmail"
                  value={replyData.originalEmail}
                  onChange={handleReplyInputChange}
                  className="form-control"
                />
              </Form.Group>
            )}
          </Form.Group>
        )}

        <Form.Group className="form-group">
          <Form.Label className="form-label">Reply Tone</Form.Label>
          <Form.Select
            name="replyTone"
            value={replyData.replyTone}
            onChange={handleReplyInputChange}
            className="form-select"
          >
            <option value="">Select tone...</option>
            <option value="Professional">Professional</option>
            <option value="Friendly">Friendly</option>
            <option value="Formal">Formal</option>
            <option value="Apologetic">Apologetic</option>
            <option value="Assertive">Assertive</option>
            <option value="Grateful">Grateful</option>
            <option value="Urgent">Urgent</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label className="form-label">Reply Objective</Form.Label>
          <Form.Select
            name="replyObjective"
            value={replyData.replyObjective}
            onChange={handleReplyInputChange}
            className="form-select"
          >
            <option value="">Select objective...</option>
            <option value="Acknowledge">Acknowledge</option>
            <option value="Provide Information">Provide Information</option>
            <option value="Request Clarification">Request Clarification</option>
            <option value="Decline Politely">Decline Politely</option>
            <option value="Accept Proposal">Accept Proposal</option>
            <option value="Schedule Meeting">Schedule Meeting</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Express Gratitude">Express Gratitude</option>
            <option value="Resolve Issue">Resolve Issue</option>
          </Form.Select>
        </Form.Group>

        <Button 
          className="features-button" 
          onClick={generateReply}
          disabled={fileProcessing.isProcessing}
        >
          <FaReply className="me-1" />
          Generate Reply
        </Button>
      </Form>
    </Card>
  );

  const renderSummarizeMode = () => (
    <Card className="input-card">
      <h3 className="mb-4">Summarize Text</h3>
      <Form>
        {/* Input Method Selection */}
        <Form.Group className="form-group">
          <Form.Label className="form-label">How would you like to provide the text to summarize?</Form.Label>
          <div className="d-flex gap-3 mb-3">
            <Form.Check
              type="radio"
              id="summarize-text-input"
              name="uploadMethod"
              value="text"
              checked={summarizeData.uploadMethod === 'text'}
              onChange={handleSummarizeInputChange}
              label={
                <span className="d-flex align-items-center">
                  <FaFile className="me-2" />
                  Type/Paste Text
                </span>
              }
            />
            <Form.Check
              type="radio"
              id="summarize-file-upload"
              name="uploadMethod"
              value="file"
              checked={summarizeData.uploadMethod === 'file'}
              onChange={handleSummarizeInputChange}
              label={
                <span className="d-flex align-items-center">
                  <FaUpload className="me-2" />
                  Upload File
                </span>
              }
            />
          </div>
        </Form.Group>

        {/* Text Input Method */}
        {summarizeData.uploadMethod === 'text' && (
          <Form.Group className="form-group">
            <Form.Label className="form-label">Text to Summarize</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              name="textToSummarize"
              value={summarizeData.textToSummarize}
              onChange={handleSummarizeInputChange}
              placeholder="Paste the text you want to summarize here..."
              className="form-control"
            />
          </Form.Group>
        )}

        {/* File Upload Method */}
        {summarizeData.uploadMethod === 'file' && (
          <Form.Group className="form-group">
            <Form.Label className="form-label">Upload File</Form.Label>
            <div className="mb-3">
              <Alert variant="info" className="small">
                <strong>Supported formats:</strong>
                <ul className="mb-0 mt-2">
                  <li><FaImage className="me-1" /> Images (JPG, PNG, GIF, BMP, WebP) - OCR text extraction</li>
                  <li><FaFilePdf className="me-1" /> PDF files - Text extraction</li>
                  <li><FaFileWord className="me-1" /> Word documents (.docx) - Text extraction</li>
                  <li><FaFile className="me-1" /> Text files (.txt) - Direct reading</li>
                </ul>
              </Alert>
            </div>
            
            <Form.Control
              type="file"
              accept=".txt,.pdf,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
              onChange={handleSummarizeFileUpload}
              className="form-control"
              disabled={fileProcessing.isProcessing}
            />
            
            {/* File Processing Status */}
            {fileProcessing.isProcessing && (
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">{fileProcessing.status}</small>
                  <small className="text-muted">{fileProcessing.progress}%</small>
                </div>
                <ProgressBar now={fileProcessing.progress} animated />
              </div>
            )}
            
            {fileProcessing.status && !fileProcessing.isProcessing && !fileProcessing.error && (
              <Alert variant="success" className="mt-3 small">
                <FaCheck className="me-1" />
                {fileProcessing.status}
              </Alert>
            )}
            
            {fileProcessing.error && (
              <Alert variant="danger" className="mt-3 small">
                <strong>Error:</strong> {fileProcessing.error}
              </Alert>
            )}
            
            {/* Extracted Text Preview */}
            {summarizeData.textToSummarize && summarizeData.uploadMethod === 'file' && (
              <Form.Group className="form-group mt-3">
                <Form.Label className="form-label">
                  <FaEye className="me-1" />
                  Extracted Text (You can edit if needed)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  name="textToSummarize"
                  value={summarizeData.textToSummarize}
                  onChange={handleSummarizeInputChange}
                  className="form-control"
                />
              </Form.Group>
            )}
          </Form.Group>
        )}

        <Button 
          className="features-button" 
          onClick={generateSummary}
          disabled={fileProcessing.isProcessing}
        >
          <FaListAlt className="me-1" />
          Generate Summary
        </Button>
      </Form>
    </Card>
  );

  const renderTemplateMode = () => (
    <Card className="input-card">
      <h3 className="mb-4">Email Templates</h3>
      <Form>
        <Form.Group className="form-group">
          <Form.Label className="form-label">Select Template</Form.Label>
          <Form.Select
            name="selectedTemplate"
            value={templateData.selectedTemplate}
            onChange={handleTemplateInputChange}
            className="form-select"
          >
            {emailTemplates.map((template) => (
              <option key={template.value} value={template.value}>
                {template.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button className="features-button" onClick={generateFromTemplate}>
          <FaFileAlt className="me-1" />
          Generate Template
        </Button>
      </Form>
    </Card>
  );

  const renderScheduleMode = () => (
    <Card className="input-card">
      <h3 className="mb-4">Schedule Meeting</h3>
      <Form>
        <Form.Group className="form-group">
          <Form.Label className="form-label">Subject</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            value={scheduleData.subject}
            onChange={handleScheduleInputChange}
            placeholder="Meeting subject..."
            className="form-control"
          />
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label className="form-label">Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={scheduleData.date}
            onChange={handleScheduleInputChange}
            className="form-control"
          />
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label className="form-label">Time</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={scheduleData.time}
            onChange={handleScheduleInputChange}
            className="form-control"
          />
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label className="form-label">Agenda (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="agenda"
            value={scheduleData.agenda}
            onChange={handleScheduleInputChange}
            placeholder="Meeting agenda..."
            className="form-control"
          />
        </Form.Group>

        <Button className="features-button" onClick={generateCalendarFile}>
          <FaDownload className="me-1" />
          Download Calendar File (.ics)
        </Button>
      </Form>
    </Card>
  );

  // Main render function with mode-based UI
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          {/* Header with mode navigation */}
          <div className="mb-4">
            <h1 className="card-title mb-3">Email Drafter</h1>
            <Nav variant="pills" className="justify-content-center">
              {modes.map((modeOption) => (
                <Nav.Item key={modeOption.key}>
                  <Nav.Link
                    active={mode === modeOption.key}
                    onClick={() => handleModeChange(modeOption.key)}
                    className="d-flex align-items-center"
                  >
                    {modeOption.icon}
                    <span className="ms-2">{modeOption.label}</span>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </div>

          {/* Response section */}
          {response && (
            <div className="mb-4">
              <h2 className="card-title" style={{ marginBottom: '6px' }}>
                {mode === 'New Email' && 'Draft Email:'}
                {mode === 'Reply' && 'Email Reply:'}
                {mode === 'Summarize' && 'Summary:'}
                {mode === 'Template' && 'Email Template:'}
              </h2>
              {mode === 'New Email' && formData.subject && (
                <h3 className="card-title" style={{ marginBottom: '12px' }}>{formData.subject}</h3>
              )}
              {mode === 'Template' && templateData.selectedTemplate && (
                <h3 className="card-title" style={{ marginBottom: '12px' }}>
                  {templateData.selectedTemplate.charAt(0).toUpperCase() + templateData.selectedTemplate.slice(1).replace('-', ' ')} Template
                </h3>
              )}
              <Card className="output-card">
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <Button
                    variant="outline-secondary"
                    onClick={resetForm}
                  >
                    <FaArrowLeft className="me-1" />
                    New {mode}
                  </Button>
                  <div className="d-flex">
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => {
                        navigator.clipboard.writeText(response);
                        alert('Copied to clipboard!');
                      }}
                    >
                      <FaCopy className="me-1" />
                      <span className="d-none d-sm-inline">Copy</span>
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        let fileName, title, content;
                        
                        if (mode === 'New Email' && formData.subject) {
                          fileName = `${formData.subject}-email.pdf`;
                          title = `Email: ${formData.subject}`;
                          content = response;
                        } else if (mode === 'Template' && templateData.selectedTemplate) {
                          const templateName = templateData.selectedTemplate.charAt(0).toUpperCase() + templateData.selectedTemplate.slice(1).replace('-', ' ');
                          fileName = `${templateData.selectedTemplate}-template.pdf`;
                          title = `${templateName} Template`;
                          content = `# ${templateName} Template\n\n${response}`;
                        } else {
                          fileName = `${mode.toLowerCase().replace(' ', '-')}.pdf`;
                          title = `${mode}`;
                          content = response;
                        }
                        
                        const { generatePDF } = PDFGenerator({
                          content,
                          fileName,
                          title
                        });
                        generatePDF();
                      }}
                      className="me-2"
                    >
                      <FaFilePdf className="me-1" />
                      <span className="d-none d-sm-inline">PDF</span>
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={() => {
                        let fileName, title, content;
                        
                        if (mode === 'New Email' && formData.subject) {
                          fileName = `${formData.subject}-email.docx`;
                          title = `Email: ${formData.subject}`;
                          content = response;
                        } else if (mode === 'Template' && templateData.selectedTemplate) {
                          const templateName = templateData.selectedTemplate.charAt(0).toUpperCase() + templateData.selectedTemplate.slice(1).replace('-', ' ');
                          fileName = `${templateData.selectedTemplate}-template.docx`;
                          title = `${templateName} Template`;
                          content = `# ${templateName} Template\n\n${response}`;
                        } else {
                          fileName = `${mode.toLowerCase().replace(' ', '-')}.docx`;
                          title = `${mode}`;
                          content = response;
                        }
                        
                        const { generateWord } = WordGenerator({
                          content,
                          fileName,
                          title
                        });
                        generateWord();
                      }}
                    >
                      <FaFileWord className="me-1" />
                      <span className="d-none d-sm-inline">Word</span>
                    </Button>
                  </div>
                </div>
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {response}
                  </ReactMarkdown>
                </div>
                <AIDisclaimer variant="light" />
              </Card>
            </div>
          )}

          {/* Mode-specific content */}
          {renderModeContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default EmailDrafter;
