import { jsPDF } from 'jspdf';

const PDFGenerator = ({ content, fileName = 'compliance-calendar.pdf' }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Set title
    doc.setFontSize(16);
    doc.text('Compliance Calendar', 20, 20);
    
    // Add content
    doc.setFontSize(12);
    
    // Split the content into lines to fit within page width
    const textLines = doc.splitTextToSize(content, 170);
    
    // Add the text lines to the document
    doc.text(textLines, 20, 30);
    
    // Save the PDF
    doc.save(fileName);
  };

  return { generatePDF };
};

export default PDFGenerator;
