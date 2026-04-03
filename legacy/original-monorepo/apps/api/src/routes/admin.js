import express from 'express';
import getClient from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper: Format member response with canonical fields
const formatMemberResponse = (member) => ({
  id: member.id,
  userId: member.userId,
  name: member.name,
  email: member.email,
  phone: member.phone,
  gender: member.gender,
  date_of_birth: member.date_of_birth,
  marital_status: member.marital_status,
  spouse_name: member.spouse_name,
  marriage_date: member.marriage_date,
  profile_photo: member.profile_photo,
  member_category: member.member_category,
  approval_status: member.approval_status,
  directory_visible: member.directory_visible,
  created: member.created,
  updated: member.updated,
});

// GET /admin/users - List all users
router.get('/users', async (req, res) => {
  const { role } = req.query;

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  let filter = '';
  if (role) {
    filter = `role="${role}"`;
  }

  const users = await pb.collection('users').getList(1, 100, {
    filter: filter || undefined,
    sort: 'email',
  });

  // Format response with only specified fields
  const formattedUsers = users.items.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
  }));

  logger.info(`Admin users list accessed${role ? ` - role: ${role}` : ''}`);

  res.json(formattedUsers);
});

// GET /admin/members - List all members
router.get('/members', async (req, res) => {
  const { approval_status } = req.query;

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  let filter = '';
  if (approval_status) {
    filter = `approval_status="${approval_status}"`;
  }

  const members = await pb.collection('members').getList(1, 100, {
    filter: filter || undefined,
    sort: '-created',
  });

  // Format response with all canonical fields
  const formattedMembers = members.items.map(formatMemberResponse);

  logger.info(`Admin members list accessed${approval_status ? ` - status: ${approval_status}` : ''}`);

  res.json(formattedMembers);
});

// PUT /admin/members/:id/approve - Approve member
router.put('/members/:id/approve', async (req, res) => {
  const { id } = req.params;

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  // Verify member exists
  const member = await pb.collection('members').getOne(id);

  if (!member) {
    throw new Error('Member not found');
  }

  // Update approval status
  const updatedMember = await pb.collection('members').update(id, {
    approval_status: 'approved',
  });

  logger.info(`Member ${id} approved via admin`);

  res.json(formatMemberResponse(updatedMember));
});

// PUT /admin/members/:id/deny - Deny member
router.put('/members/:id/deny', async (req, res) => {
  const { id } = req.params;

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  // Verify member exists
  const member = await pb.collection('members').getOne(id);

  if (!member) {
    throw new Error('Member not found');
  }

  // Update approval status
  const updatedMember = await pb.collection('members').update(id, {
    approval_status: 'denied',
  });

  logger.info(`Member ${id} denied via admin`);

  res.json(formatMemberResponse(updatedMember));
});

export default router;
