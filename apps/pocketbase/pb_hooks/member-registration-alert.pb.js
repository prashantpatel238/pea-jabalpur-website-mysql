/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Only send alert if approval_status is 'pending'
  if (e.record.get("approval_status") !== "pending") {
    e.next();
    return;
  }

  try {
    // Get member details
    const fullName = e.record.get("full_name") || "N/A";
    const email = e.record.get("email") || "N/A";
    const mobileNumber = e.record.get("mobile_number") || "N/A";
    const createdAt = e.record.get("created") || new Date().toISOString();
    
    // Format the created timestamp
    const createdDate = new Date(createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    // Find all admins and member managers
    const adminUsers = $app.findRecordsByFilter("users", "role='admin' || role='member_manager'", {
      sort: "-created"
    });

    // Send email to each admin/manager
    adminUsers.forEach((adminUser) => {
      try {
        const adminEmail = adminUser.get("email");
        if (!adminEmail) return;

        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
    .member-details { background: white; padding: 20px; border-left: 4px solid #2a5298; margin: 20px 0; border-radius: 4px; }
    .detail-row { margin: 12px 0; }
    .detail-label { font-weight: bold; color: #2a5298; display: inline-block; width: 120px; }
    .detail-value { color: #555; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; font-weight: bold; }
    .cta-button:hover { opacity: 0.9; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
    .brand { color: #2a5298; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Member Registration</h1>
      <p>Pending Approval Required</p>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>A new member has registered with <span class="brand">PEA Jabalpur</span> and is awaiting your approval.</p>
      
      <div class="member-details">
        <div class="detail-row">
          <span class="detail-label">Full Name:</span>
          <span class="detail-value">${fullName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Mobile:</span>
          <span class="detail-value">${mobileNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Registered:</span>
          <span class="detail-value">${createdDate}</span>
        </div>
      </div>

      <p>Please review this registration and take appropriate action.</p>
      
      <center>
        <a href="/admin/approvals" class="cta-button">Review Pending Approvals</a>
      </center>

      <div class="footer">
        <p>This is an automated notification from <span class="brand">PEA Jabalpur</span> Member Management System.</p>
      </div>
    </div>
  </div>
</body>
</html>
        `;

        const message = new MailerMessage({
          from: {
            address: $app.settings().meta.senderAddress,
            name: "PEA Jabalpur - Member Management"
          },
          to: [{ address: adminEmail }],
          subject: "New Member Registration - Pending Approval",
          html: htmlBody
        });

        $app.newMailClient().send(message);
      } catch (adminEmailError) {
        console.error("Failed to send alert email to admin: " + adminEmailError.message);
        // Continue processing other admins even if one fails
      }
    });
  } catch (error) {
    console.error("Error in member registration alert hook: " + error.message);
    // Do NOT block member creation - continue execution
  }

  e.next();
}, "members");