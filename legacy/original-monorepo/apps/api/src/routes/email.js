import express from 'express';
import getClient from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /send-member-approval-email
router.post('/send-member-approval-email', async (req, res) => {
  const { memberId, memberEmail, memberName } = req.body;

  if (!memberEmail || !memberName) {
    return res.status(400).json({ error: 'memberEmail and memberName are required' });
  }

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;

  const emailBody = `
Dear ${memberName},

Congratulations! Your registration with the Professional Engineers Association Jabalpur has been approved.

You can now log in to your account using the following link:
${loginLink}

Login Instructions:
1. Visit the login link above
2. Enter your email address: ${memberEmail}
3. Enter your password
4. Click "Login"

If you have any questions or need assistance, please contact our support team.

Best regards,
Professional Engineers Association Jabalpur
  `.trim();

  await pb.send('email', {
    to: memberEmail,
    subject: 'Your Registration Approved - Professional Engineers Association Jabalpur',
    html: emailBody.replace(/\n/g, '<br>'),
  });

  logger.info(`Approval email sent to ${memberEmail} for member ${memberId}`);

  res.json({ success: true, message: 'Email sent' });
});

// POST /send-member-denial-email
router.post('/send-member-denial-email', async (req, res) => {
  const { memberEmail, memberName, reason } = req.body;

  if (!memberEmail || !memberName) {
    return res.status(400).json({ error: 'memberEmail and memberName are required' });
  }

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  const reasonText = reason ? `\n\nReason: ${reason}` : '';

  const emailBody = `
Dear ${memberName},

Thank you for your interest in joining the Professional Engineers Association Jabalpur.

Unfortunately, your registration application has not been approved at this time.${reasonText}

If you have any questions or would like to reapply, please contact our support team.

Best regards,
Professional Engineers Association Jabalpur
  `.trim();

  await pb.send('email', {
    to: memberEmail,
    subject: 'Registration Status Update - Professional Engineers Association Jabalpur',
    html: emailBody.replace(/\n/g, '<br>'),
  });

  logger.info(`Denial email sent to ${memberEmail} for member ${memberName}`);

  res.json({ success: true, message: 'Email sent' });
});

// POST /send-admin-notification-email
router.post('/send-admin-notification-email', async (req, res) => {
  const { adminEmail, memberName, memberEmail, memberMobile, memberId } = req.body;

  if (!adminEmail || !memberName || !memberEmail) {
    return res.status(400).json({ error: 'adminEmail, memberName, and memberEmail are required' });
  }

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  const approvalLink = `${process.env.ADMIN_PANEL_URL || 'http://localhost:5173/admin'}/members/${memberId}`;

  const emailBody = `
New Member Registration Notification

A new member has registered with the Professional Engineers Association Jabalpur.

Member Details:
- Name: ${memberName}
- Email: ${memberEmail}
- Mobile: ${memberMobile || 'Not provided'}
- Member ID: ${memberId}

Please review the registration and take appropriate action:
${approvalLink}

Best regards,
Professional Engineers Association Jabalpur System
  `.trim();

  await pb.send('email', {
    to: adminEmail,
    subject: `New Member Registration - ${memberName}`,
    html: emailBody.replace(/\n/g, '<br>'),
  });

  logger.info(`Admin notification email sent to ${adminEmail} for member ${memberId}`);

  res.json({ success: true, message: 'Email sent' });
});

export default router;
