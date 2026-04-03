/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  // Check if approval_status changed from 'pending' to 'approved'
  const originalRecord = e.record.original();
  const originalStatus = originalRecord.get("approval_status");
  const newStatus = e.record.get("approval_status");

  if (originalStatus !== "pending" || newStatus !== "approved") {
    e.next();
    return;
  }

  try {
    // Get member details
    const fullName = e.record.get("full_name") || "Member";
    const memberEmail = e.record.get("email");

    if (!memberEmail) {
      console.warn("Member record has no email address - skipping approval confirmation");
      e.next();
      return;
    }

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
    .success-badge { display: inline-block; background: #4CAF50; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 15px 0; }
    .instructions { background: white; padding: 20px; border-left: 4px solid #2a5298; margin: 20px 0; border-radius: 4px; }
    .instructions h3 { color: #2a5298; margin-top: 0; }
    .instructions ol { margin: 10px 0; padding-left: 20px; }
    .instructions li { margin: 8px 0; }
    .button-group { text-align: center; margin: 30px 0; }
    .cta-button { display: inline-block; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 0 10px; font-weight: bold; transition: opacity 0.3s; }
    .cta-button-primary { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; }
    .cta-button-secondary { background: #f0f0f0; color: #2a5298; border: 2px solid #2a5298; }
    .cta-button:hover { opacity: 0.9; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
    .brand { color: #2a5298; font-weight: bold; }
    .welcome-message { font-size: 16px; color: #333; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to PEA Jabalpur!</h1>
      <p>Your Membership Has Been Approved</p>
    </div>
    <div class="content">
      <p>Dear <strong>${fullName}</strong>,</p>
      
      <div class="success-badge">✓ Membership Approved</div>

      <p class="welcome-message">Congratulations! Your membership application has been reviewed and approved. We're excited to have you as part of the <span class="brand">PEA Jabalpur</span> community.</p>

      <div class="instructions">
        <h3>Getting Started</h3>
        <p>You can now access your member account using the following credentials:</p>
        <ol>
          <li><strong>Email:</strong> ${memberEmail}</li>
          <li><strong>Password:</strong> The password you created during registration</li>
        </ol>
        <p>Visit our member portal and log in with your registered email address and password to access your dashboard and member directory.</p>
      </div>

      <div class="button-group">
        <a href="/dashboard" class="cta-button cta-button-primary">Go to Dashboard</a>
        <a href="/directory" class="cta-button cta-button-secondary">View Member Directory</a>
      </div>

      <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>

      <div class="footer">
        <p>This is an automated notification from <span class="brand">PEA Jabalpur</span> Member Management System.</p>
        <p>© 2024 PEA Jabalpur. All rights reserved.</p>
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
      to: [{ address: memberEmail }],
      subject: "Your PEA Jabalpur Membership Approved!",
      html: htmlBody
    });

    $app.newMailClient().send(message);
  } catch (error) {
    console.error("Error in member approval confirmation hook: " + error.message);
    // Do NOT block the approval update - continue execution
  }

  e.next();
}, "members");