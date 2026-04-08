const ExcelJS = require("exceljs");

function getExcelColumnName(columnNumber) {
  let current = columnNumber;
  let columnName = "";

  while (current > 0) {
    const remainder = (current - 1) % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName;
    current = Math.floor((current - 1) / 26);
  }

  return columnName;
}

function parseDate(value) {
  if (!value || value === "0000-00-00" || value === "0000-00-00 00:00:00") {
    return null;
  }

  const parsedDate = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function formatDate(value) {
  const parsedDate = parseDate(value);

  if (!parsedDate) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function formatDateTime(value) {
  const parsedDate = parseDate(value);

  if (!parsedDate) {
    return "";
  }

  return parsedDate.toISOString();
}

async function exportMembersWorkbook(members = []) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "PEA Jabalpur";
  workbook.created = new Date();
  const worksheet = workbook.addWorksheet("Members");

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Member ID", key: "member_id", width: 18 },
    { header: "Full Name", key: "full_name", width: 28 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Role", key: "role", width: 22 },
    { header: "Profession", key: "profession", width: 24 },
    { header: "City", key: "city", width: 18 },
    { header: "Address", key: "address", width: 36 },
    { header: "DOB", key: "dob", width: 14 },
    { header: "Age", key: "age", width: 10 },
    { header: "Gender", key: "gender", width: 18 },
    { header: "Blood Group", key: "blood_group", width: 18 },
    { header: "Marital Status", key: "marital_status", width: 18 },
    { header: "Marriage Date", key: "marriage_date", width: 16 },
    { header: "Spouse Name", key: "spouse_name", width: 24 },
    { header: "Children Count", key: "children_count", width: 16 },
    { header: "Leadership Title", key: "leadership_title", width: 24 },
    { header: "Membership Status", key: "membership_status", width: 18 },
    { header: "Approval Date", key: "approval_date", width: 20 },
    { header: "Approved By Admin", key: "approved_by_admin", width: 18 },
    { header: "Show In Directory", key: "show_in_directory", width: 18 },
    { header: "Show Mobile", key: "show_mobile_in_directory", width: 16 },
    { header: "Show Email", key: "show_email_in_directory", width: 16 },
    { header: "Show City", key: "show_city_in_directory", width: 14 },
    { header: "Show Profession", key: "show_profession_in_directory", width: 18 },
    { header: "Show Photo", key: "show_photo_in_directory", width: 14 },
    { header: "Show In Leadership", key: "show_in_leadership_section", width: 20 },
    { header: "Important Member", key: "is_important_member", width: 18 },
    { header: "Important Order", key: "important_member_order", width: 18 },
    { header: "Registration Source", key: "registration_source", width: 18 },
    { header: "Join Date", key: "join_date", width: 14 },
    { header: "Last Login At", key: "last_login_at", width: 20 },
    { header: "Created At", key: "created_at", width: 20 },
    { header: "Updated At", key: "updated_at", width: 20 },
    { header: "Notes", key: "notes", width: 36 },
    { header: "Admin Notes", key: "admin_notes", width: 36 }
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.autoFilter = {
    from: "A1",
    to: `${getExcelColumnName(worksheet.columns.length)}1`
  };

  members.forEach((member) => {
    worksheet.addRow({
      ...member,
      dob: formatDate(member.dob),
      marriage_date: formatDate(member.marriage_date),
      approval_date: formatDateTime(member.approval_date),
      join_date: formatDate(member.join_date),
      last_login_at: formatDateTime(member.last_login_at),
      created_at: formatDateTime(member.created_at),
      updated_at: formatDateTime(member.updated_at),
      approved_by_admin: member.approved_by_admin ? "Yes" : "No",
      show_in_directory: member.show_in_directory ? "Yes" : "No",
      show_mobile_in_directory: member.show_mobile_in_directory ? "Yes" : "No",
      show_email_in_directory: member.show_email_in_directory ? "Yes" : "No",
      show_city_in_directory: member.show_city_in_directory ? "Yes" : "No",
      show_profession_in_directory: member.show_profession_in_directory ? "Yes" : "No",
      show_photo_in_directory: member.show_photo_in_directory ? "Yes" : "No",
      show_in_leadership_section: member.show_in_leadership_section ? "Yes" : "No",
      is_important_member: member.is_important_member ? "Yes" : "No"
    });
  });

  return workbook;
}

module.exports = {
  exportMembersWorkbook
};
