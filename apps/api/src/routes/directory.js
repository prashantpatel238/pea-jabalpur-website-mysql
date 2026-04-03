import express from 'express';
import getClient from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /directory - List directory members
router.get('/', async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;

  const pb = await getClient();
  if (!pb) {
    throw new Error('Backend service unavailable');
  }

  const members = await pb.collection('members').getList(parseInt(page), parseInt(perPage), {
    filter: 'directory_visible=true && approval_status="approved"',
    sort: 'name',
  });

  // Format response with only specified fields
  const formattedMembers = members.items.map((m) => ({
    id: m.id,
    userId: m.userId,
    name: m.name,
    email: m.email,
    phone: m.phone,
    member_category: m.member_category,
  }));

  logger.info(`Directory accessed - page ${page}, perPage ${perPage}`);

  res.json(formattedMembers);
});

// GET /directory/settings - Get directory configuration
router.get('/settings', async (req, res) => {
  // Return empty object for now, can be extended later
  res.json({});
});

export default router;
