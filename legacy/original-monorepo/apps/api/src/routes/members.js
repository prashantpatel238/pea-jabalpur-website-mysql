import express from 'express';
import getClient from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper: Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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

// POST /members - Create user + member
router.post('/', async (req, res) => {
  const { name, email, password, phone, gender, date_of_birth, marital_status, spouse_name, marriage_date, member_category } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'password is required' });
  }
  if (!phone) {
    return res.status(400).json({ error: 'phone is required' });
  }
  if (!member_category) {
    return res.status(400).json({ error: 'member_category is required' });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  // Check if email already exists in users collection
  try {
    await pb.collection('users').getFirstListItem(`email="${email}"`);
    // If we reach here, email exists
    throw new Error('Email already registered');
  } catch (error) {
    // Expected: email not found, continue
    if (error.message === 'Email already registered') {
      throw error;
    }
    if (!error.message.includes('Failed to find')) {
      throw error;
    }
  }

  // (1) Create user record
  const user = await pb.collection('users').create({
    email,
    password,
    passwordConfirm: password,
    role: 'member',
  });

  // (2) Create member record
  const member = await pb.collection('members').create({
    userId: user.id,
    name,
    email,
    phone,
    gender: gender || null,
    date_of_birth: date_of_birth || null,
    marital_status: marital_status || null,
    spouse_name: spouse_name || null,
    marriage_date: marriage_date || null,
    member_category,
    approval_status: 'pending',
    directory_visible: false,
  });

  logger.info(`New user and member created: ${email} with member ID: ${member.id}`);

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    member: formatMemberResponse(member),
  });
});

// GET /members - List all members
router.get('/', async (req, res) => {
  const { approval_status } = req.query;
  let filter = '';

  if (approval_status) {
    filter = `approval_status = "${approval_status}"`;
  }

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  const members = await pb.collection('members').getList(1, 50, {
    filter: filter || undefined,
    sort: '-created',
  });

  // Map items to ensure canonical field names
  const mappedMembers = members.items.map(formatMemberResponse);

  res.json(mappedMembers);
});

// GET /members/:id - Get single member by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  const member = await pb.collection('members').getOne(id);

  res.json(formatMemberResponse(member));
});

// PUT /members/:id - Update member
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, gender, date_of_birth, marital_status, spouse_name, marriage_date, profile_photo, member_category, directory_visible } = req.body;

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (gender !== undefined) updateData.gender = gender;
  if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth;
  if (marital_status !== undefined) updateData.marital_status = marital_status;
  if (spouse_name !== undefined) updateData.spouse_name = spouse_name;
  if (marriage_date !== undefined) updateData.marriage_date = marriage_date;
  if (profile_photo !== undefined) updateData.profile_photo = profile_photo;
  if (member_category !== undefined) updateData.member_category = member_category;
  if (directory_visible !== undefined) updateData.directory_visible = directory_visible;

  const updatedMember = await pb.collection('members').update(id, updateData);

  logger.info(`Member ${id} updated`);

  res.json(formatMemberResponse(updatedMember));
});

// PUT /members/:id/approve - Approve member
router.put('/:id/approve', async (req, res) => {
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

  logger.info(`Member ${id} approved`);

  res.json(formatMemberResponse(updatedMember));
});

// PUT /members/:id/deny - Deny member
router.put('/:id/deny', async (req, res) => {
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

  logger.info(`Member ${id} denied`);

  res.json(formatMemberResponse(updatedMember));
});

export default router;
