import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

export const generateAttendanceReport = async (data, options = {}) => {
  const doc = new jsPDF();
  const { title, date, ministry } = options;

  // Add header
  doc.setFontSize(16);
  doc.text(title || 'Attendance Report', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Date: ${moment(date).format('MMMM D, YYYY')}`, 20, 25);
  if (ministry) {
    doc.text(`Ministry: ${ministry}`, 20, 32);
  }

  // Add statistics
  doc.autoTable({
    startY: 40,
    head: [['Metric', 'Value']],
    body: [
      ['Total Members', data.stats.total],
      ['Present', data.stats.present],
      ['Absent', data.stats.absent],
      ['Attendance Rate', `${data.stats.rate}%`],
      ['First Time Visitors', data.stats.firstTimers || 0]
    ]
  });

  // Add attendance list
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Name', 'Category', 'Status', 'Notes']],
    body: data.attendees.map(member => [
      `${member.firstName} ${member.lastName}`,
      member.category,
      member.status,
      member.notes || ''
    ])
  });

  return doc;
}; 