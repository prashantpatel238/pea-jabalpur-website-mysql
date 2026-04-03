import express from 'express';
import logger from '../utils/logger.js';
import { getConnectionState, checkBackendHealth } from '../utils/pocketbaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const connectionState = getConnectionState();
  
  // Check backend connectivity
  const backendHealthy = await checkBackendHealth();

  const healthResponse = {
    status: 'ok', // API server is always healthy
    timestamp: new Date().toISOString(),
    apiServer: 'running',
    backend: backendHealthy ? 'available' : 'unavailable',
    pocketbaseUrl: connectionState.url,
    connectionDetails: {
      connected: connectionState.connected,
      lastAttempt: connectionState.lastAttempt,
      retryCount: connectionState.retryCount,
    },
  };

  if (!backendHealthy && connectionState.lastError) {
    healthResponse.backendError = connectionState.lastError;
    healthResponse.troubleshooting = {
      message: 'Backend service is unavailable',
      url: connectionState.url,
      suggestion: `Ensure PocketBase is running at ${connectionState.url}`,
    };
  }

  logger.info(`Health check requested - API: ok, Backend: ${healthResponse.backend}`);

  // Always return 200 - API server is healthy even if backend is down
  res.status(200).json(healthResponse);
});

export default router;