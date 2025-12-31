import express from "express";
import * as tourController from "../controllers/tour.mjs";
import { authenticate, authorizeGuide } from "../middlewares/auth.mjs";
import {
  validateTourCreation,
  validateTourUpdate,
} from "../validators/tourValidator.mjs";

const router = express.Router();

/**
 * ========================================
 * PUBLIC ROUTES (No authentication)
 * ========================================
 */

// Landing Page - Get top rated tours
// GET /api/tours/top-rated?limit=6
router.get("/top-rated", tourController.getTopRatedTours);

// Get all cities for filter dropdown
// GET /api/tours/cities
router.get("/cities", tourController.getCities);

// Tours Page - Advanced search with filters
// GET /api/tours/search?city=Alger&maxPrice=10000&durationType=half-day,one-day&guideID=5&search=casbah&page=1&limit=12
router.get("/search", tourController.searchTours);

// Tour Details Page - Get full tour details with weather
// GET /api/tours/:tourID?visitDate=2024-12-30
router.get("/:tourID", tourController.getTourDetails);

// Get tour reviews (moved to review routes, but kept for backwards compatibility)
// GET /api/tours/:tourID/reviews?page=1&limit=10
router.get("/:tourID/reviews", tourController.getTourReviews);

/**
 * ========================================
 * PROTECTED ROUTES (Authentication required)
 * ========================================
 */

// Guide Dashboard - Get guide's tours
// GET /api/tours/guide/my-tours?page=1&limit=10
router.get(
  "/guide/my-tours",
  authenticate,
  authorizeGuide,
  tourController.getGuideTours
);

// Create new tour (guides only)
// POST /api/tours
router.post(
  "/",
  authenticate,
  authorizeGuide,
  validateTourCreation,
  tourController.createTour
);

// Update tour (guides only, own tours)
// PUT /api/tours/:tourID
router.put(
  "/:tourID",
  authenticate,
  authorizeGuide,
  validateTourUpdate,
  tourController.updateTour
);

// Add tour photos (guides only, own tours)
// POST /api/tours/:tourID/photos
router.post(
  "/:tourID/photos",
  authenticate,
  authorizeGuide,
  tourController.addTourPhotos
);

// Delete tour photo (guides only, own tours)
// DELETE /api/tours/:tourID/photos/:photoID
router.delete(
  "/:tourID/photos/:photoID",
  authenticate,
  authorizeGuide,
  tourController.deleteTourPhotos
);

// Delete tour (guides only, own tours)
// DELETE /api/tours/:tourID
router.delete(
  "/:tourID",
  authenticate,
  authorizeGuide,
  tourController.deleteTour
);

export default router;
