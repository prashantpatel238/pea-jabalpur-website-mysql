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

// GET /profile/:userId - Get member by userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  const member = await pb.collection('members').getFirstListItem(`userId="${userId}"`);

  if (!member) {
    throw new Error('Member not found');
  }

  res.json(formatMemberResponse(member));
});

// PUT /profile/:userId - Update member by userId
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, email, phone, gender, date_of_birth, marital_status, spouse_name, marriage_date, profile_photo, member_category, directory_visible } = req.body;

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  // Get member by userId
  const member = await pb.collection('members').getFirstListItem(`userId="${userId}"`);

  if (!member) {
    throw new Error('Member not found');
  }

  // Build update data with only provided fields
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

  // Update member record
  const updatedMember = await pb.collection('members').update(member.id, updateData);

  logger.info(`Member profile updated for userId ${userId}`);

  res.json(formatMemberResponse(updatedMember));
});

export default router;
