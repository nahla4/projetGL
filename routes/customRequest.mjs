import express from 'express';
import * as customRequestController from '../controllers/customRequest.mjs';
import { authenticate, authorizeGuide, authorizeTourist } from '../middlewares/auth.mjs';
import { validateCustomRequestCreation } from '../validators/customRequestValidator.mjs';
import { validate } from '../middlewares/validate.mjs';

const router = express.Router();

/*
GUIDE ROUTES - Browse custom requests
 */

// Browse all available custom requests (for guides to find opportunities)
// GET /api/custom-requests?cityID=1&status=pending&page=1&limit=10
router.get('/', authenticate, authorizeGuide, customRequestController.getAllCustomRequests);

// Get specific custom request details
// GET /api/custom-requests/:customRequestID
router.get('/:customRequestID', authenticate, customRequestController.getCustomRequestById);

// Apply to a custom request (assign yourself as the guide)
// POST /api/custom-requests/:customRequestID/assign
router.post(
  '/:customRequestID/assign',
  authenticate,
  authorizeGuide,
  customRequestController.assignGuide
);

// Get guide's assigned custom requests
// GET /api/custom-requests/guide/assigned?status=assigned&page=1&limit=10
router.get('/guide/assigned', authenticate, authorizeGuide, customRequestController.getGuideCustomRequests);

/*
 TOURIST ROUTES
 */

// Create a custom tour request
// POST /api/custom-requests
// Body: { requestedCityID, gps_latitude?, gps_longitude?, startDate, endDate, details }
router.post(
  '/',
  authenticate,
  authorizeTourist,
  validateCustomRequestCreation,
  validate,
  customRequestController.createCustomRequest
);

// Get tourist's custom requests
// GET /api/custom-requests/tourist/my-requests?status=pending&page=1&limit=10
router.get('/tourist/my-requests', authenticate, authorizeTourist, customRequestController.getTouristCustomRequests);

// Delete own custom request (only if still pending)
// DELETE /api/custom-requests/:customRequestID
router.delete(
  '/:customRequestID',
  authenticate,
  authorizeTourist,
  customRequestController.deleteCustomRequest
);

/**
 * ========================================
 * SHARED ROUTES (Both tourists and guides)
 * ========================================
 */

// Update custom request status
// PUT /api/custom-requests/:customRequestID/status
// Body: { status: "pending" | "assigned" | "completed" | "cancelled" }
router.put(
  '/:customRequestID/status',
  authenticate,
  customRequestController.updateCustomRequestStatus
);

export default router;