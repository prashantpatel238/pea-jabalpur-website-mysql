import express from 'express';
import getClient from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'email, password, and full_name are required' });
  }

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  // Create user record
  const user = await pb.collection('users').create({
    email,
    password,
    passwordConfirm: password,
    full_name,
    user_role: 'member',
  });

  // Create member record with pending approval
  const member = await pb.collection('members').create({
    user_id: user.id,
    full_name,
    email,
    approval_status: 'pending',
  });

  logger.info(`New user registered: ${email} with member ID: ${member.id}`);

  res.status(201).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      user_role: user.user_role,
    },
    member: {
      id: member.id,
      approval_status: member.approval_status,
    },
  });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  // Authenticate user
  const authData = await pb.collection('users').authWithPassword(email, password);

  // Get member data
  const members = await pb.collection('members').getFullList({
    filter: `user_id = "${authData.record.id}"`,
  });

  const member = members.length > 0 ? members[0] : null;

  logger.info(`User logged in: ${email}`);

  res.json({
    success: true,
    user: {
      id: authData.record.id,
      email: authData.record.email,
      full_name: authData.record.full_name,
      user_role: authData.record.user_role,
    },
    member: member ? {
      id: member.id,
      approval_status: member.approval_status,
      member_category: member.member_category,
    } : null,
    token: authData.token,
  });
});

// GET /auth/me
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  // Verify token and get user
  const user = await pb.collection('users').authRefresh({
    token,
  }).catch(() => {
    throw new Error('Invalid or expired token');
  });

  // Get member data
  const members = await pb.collection('members').getFullList({
    filter: `user_id = "${user.record.id}"`,
  });

  const member = members.length > 0 ? members[0] : null;

  res.json({
    user: {
      id: user.record.id,
      email: user.record.email,
      full_name: user.record.full_name,
      user_role: user.record.user_role,
    },
    member: member ? {
      id: member.id,
      approval_status: member.approval_status,
      member_category: member.member_category,
    } : null,
  });
});

export default router;
