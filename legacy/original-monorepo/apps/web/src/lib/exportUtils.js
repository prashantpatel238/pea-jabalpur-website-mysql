
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
};

const formatCustomValue = (value, type) => {
  if (!value) return '';
  if (type === 'checkbox') {
    try {
      const arr = JSON.parse(value);
      return Array.isArray(arr) ? arr.join(', ') : value;
    } catch (e) {
      return value;
    }
  }
  if (type === 'date') {
    return formatDate(value);
  }
  return value;
};

const prepareExportData = (members, config, customFields) => {
  // Filter visible custom fields based on config
  const visibleCustomFields = customFields.filter(cf => 
    config.custom_fields_visible?.includes(cf.id)
  );

  // Define headers
  const headers = ['Full Name', 'Category'];
  if (config.show_profession_designation) headers.push('Profession/Designation');
  if (config.show_email) headers.push('Email');
  if (config.show_phone) headers.push('Phone');
  if (config.show_date_of_birth) headers.push('Date of Birth');
  if (config.show_address) headers.push('Address');
  
  visibleCustomFields.forEach(cf => {
    headers.push(cf.label);
  });

  // Map rows
  const rows = members.map(member => {
    const rowData = [
      member.full_name || '',
      member.member_category || 'General Member'
    ];

    if (config.show_profession_designation) rowData.push(member.profession_designation || '');
    if (config.show_email) rowData.push(member.email || '');
    if (config.show_phone) rowData.push(member.mobile_number || member.phone || '');
    if (config.show_date_of_birth) rowData.push(formatDate(member.date_of_birth));
    if (config.show_address) rowData.push(member.address || '');

    visibleCustomFields.forEach(cf => {
      const val = member.customValues?.[cf.id];
      rowData.push(formatCustomValue(val, cf.field_type));
    });

    return rowData;
  });

  // Create array of objects for easier CSV/Excel generation if needed, 
  // but arrays of arrays are better for strict column ordering.
  const dataObjects = members.map(member => {
    const obj = {
      'Full Name': member.full_name || '',
      'Category': member.member_category || 'General Member'
    };
    if (config.show_profession_designation) obj['Profession/Designation'] = member.profession_designation || '';
    if (config.show_email) obj['Email'] = member.email || '';
    if (config.show_phone) obj['Phone'] = member.mobile_number || member.phone || '';
    if (config.show_date_of_birth) obj['Date of Birth'] = formatDate(member.date_of_birth);
    if (config.show_address) obj['Address'] = member.address || '';
    
    visibleCustomFields.forEach(cf => {
      obj[cf.label] = formatCustomValue(member.customValues?.[cf.id], cf.field_type);
    });
    return obj;
  });

  return { headers, rows, dataObjects };
};

const getFilename = (extension) => {
  const date = new Date().toISOString().split('T')[0];
  return `members_export_${date}.${extension}`;
};

export const exportToCSV = (members, config, customFields) => {
  const { headers, rows } = prepareExportData(members, config, customFields);
  
  // Escape fields containing commas, quotes, or newlines
  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '';
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', getFilename('csv'));
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (members, config, customFields) => {
  const { dataObjects } = prepareExportData(members, config, customFields);
  
  const worksheet = XLSX.utils.json_to_sheet(dataObjects);
  const workbook = XLSX.utils.book_new();
  
  // Auto-fit columns (basic approximation)
  const colWidths = [];
  dataObjects.forEach(row => {
    Object.keys(row).forEach((key, i) => {
      const val = String(row[key] || '');
      const len = Math.max(val.length, key.length);
      if (!colWidths[i] || colWidths[i].wch < len) {
        colWidths[i] = { wch: Math.min(len + 2, 50) }; // Cap width at 50
      }
    });
  });
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');
  XLSX.writeFile(workbook, getFilename('xlsx'));
};

export const exportToPDF = (members, config, customFields) => {
  const { headers, rows } = prepareExportData(members, config, customFields);
  
  // Initialize jsPDF in landscape mode
  const doc = new jsPDF('landscape');
  
  const title = 'PEA Jabalpur Member Directory';
  const dateStr = `Exported on: ${new Date().toLocaleDateString()}`;
  const countStr = `Total Members: ${members.length}`;

  // Add Title
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 22);
  
  // Add Meta info
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(dateStr, 14, 30);
  doc.text(countStr, 14, 35);

  // Generate Table
  doc.autoTable({
    startY: 40,
    head: [headers],
    body: rows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [41, 128, 185], // A nice professional blue
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    margin: { top: 40, right: 14, bottom: 20, left: 14 },
    didDrawPage: function (data) {
      // Footer with page numbers
      const str = 'Page ' + doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    }
  });

  doc.save(getFilename('pdf'));
};
