import jsPDF from 'jspdf';

export const generateAgreementPDF = (title: string, content: string) => {
  const pdf = new jsPDF();
  
  // Add title
  pdf.setFontSize(16);
  pdf.text(title, 20, 20);
  
  // Add content with word wrap
  pdf.setFontSize(12);
  const splitText = pdf.splitTextToSize(content, 170);
  pdf.text(splitText, 20, 40);

  return pdf;
};

export const stripHtmlTags = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};