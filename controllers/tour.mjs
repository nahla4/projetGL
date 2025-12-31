import * as tourModel from '../models/tour.mjs';
import { validationResult } from 'express-validator';
import weatherService from '../utils/weatherService.mjs';
/**
 * ========================================
 * PUBLIC CONTROLLERS
 * ========================================
 */

// Get top rated tours for landing page
export const getTopRatedTours = async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    const tours = await tourModel.getTopRatedTours(parseInt(limit));

    res.json({
      success: true,
      data: tours,
      message: `Top ${tours.length} rated tours`
    });
  } catch (error) {
    console.error('Error fetching top rated tours:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top rated tours'
    });
  }
};

// Advanced search with multiple filters for tours page
export const searchTours = async (req, res) => {
  try {
    const { 
      city, 
      maxPrice, 
      durationType, // Can be: 'half-day', 'one-day', 'multi-day' (comma-separated)
      guideID,
      guideName,
      search,
      page,
      limit 
    } = req.query;

    // Parse duration types from comma-separated string
    let durationTypeArray = null;
    if (durationType) {
      durationTypeArray = durationType.split(',').map(d => d.trim());
    }

    const filters = {
      city: city || null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      durationType: durationTypeArray,
      guideID: guideID ? parseInt(guideID) : null,
      guideName: guideName || null,
      searchTerm: search || null,
      // pagination
      page: page ? parseInt(page) : 1,
      limit: limit ? Math.min(parseInt(limit), 1000) : 1000
    };


    const result = await tourModel.searchTours(filters);

    res.json({
      success: true,
      data: result.tours,
      pagination: result.pagination,
      appliedFilters: {
        city: filters.city,
        maxPrice: filters.maxPrice,
        durationType: filters.durationType,
        guideID: filters.guideID,
        guideName: filters.guideName,
        search: filters.searchTerm
      }
    });
  } catch (error) {
    console.error('Error searching tours:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching tours'
    });
  }
};

// Get tour details with weather forecast
export const getTourDetails = async (req, res) => {
  try {
    const { tourID } = req.params;
    const { visitDate } = req.query;

    const tour = await tourModel.getTourById(tourID);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    // Fetch weather if date provided and within 5 days
    let weatherData = null;
    if (visitDate && tour.gps_latitude && tour.gps_longitude) {
      const requestedDate = new Date(visitDate);
      const today = new Date();
      const daysUntilVisit = Math.ceil((requestedDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilVisit >= 0 && daysUntilVisit <= 5) {
        try {
          weatherData = await weatherService.getForecast(
            tour.gps_latitude,
            tour.gps_longitude,
            visitDate
          );
        } catch (weatherError) {
          console.error('Weather API error:', weatherError);
          // Continue without weather data
        }
      }
    }

    res.json({
      success: true,
      data: {
        tour,
        weather: weatherData
      }
    });
  } catch (error) {
    console.error('Error fetching tour details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tour details'
    });
  }
};

// Get tour reviews (kept for backwards compatibility)
export const getTourReviews = async (req, res) => {
  try {
    const { tourID } = req.params;
    const { page, limit } = req.query;

    const result = await tourModel.getTourReviews(
      tourID, 
      page || 1, 
      limit || 10
    );


    res.json({
      success: true,
      data: result.reviews,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching tour reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tour reviews'
    });
  }
};

// Get all cities for filter dropdown
export const getCities = async (req, res) => {
  try {
    const cities = await tourModel.getAllCities();

    res.json({
      success: true,
      data: cities,
      count: cities.length
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * ========================================
 * PROTECTED CONTROLLERS (GUIDES)
 * ========================================
 */

// Create tour (guide only)
export const createTour = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const guideID = req.user.userID;
    const tourData = {
      ...req.body,
      guideID
    };

    const result = await tourModel.createTour(tourData);

    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: {
        tourID: result.tourID,
        calculatedPrice: result.calculatedPrice
      }
    });
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating tour'
    });
  }
};

// Update tour (guide only, own tours)
export const updateTour = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { tourID } = req.params;
    const guideID = req.user.userID;

    await tourModel.updateTour(tourID, guideID, req.body);

    // Fetch updated tour
    const updatedTour = await tourModel.getTourById(tourID);

    res.json({
      success: true,
      message: 'Tour updated successfully',
      data: updatedTour
    });
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating tour'
    });
  }
};

//add tour Photos (guide only, own tours)
export const addTourPhotos = async (req, res) => {
  try {
    const { tourID } = req.params;
    const { photos } = req.body; // array of URLs

    if (!Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Photos must be a non-empty array'
      });
    }

    await tourModel.addPhotos(tourID, photos);

    res.json({
      success: true,
      message: 'Photos added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to add photos'
    });
  }
};


// Delete tour photo (guide only, own tours)
export const deleteTourPhotos = async (req, res) => {
  try {
    const { tourID } = req.params;        
    const { photoIDs } = req.body;        

    if (!Array.isArray(photoIDs) || photoIDs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'photoIDs must be a non-empty array'
      });
    }

    await tourModel.deletePhotos(tourID, photoIDs);

    res.json({
      success: true,
      message: 'Photos deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete photos'
    });
  }
};

// Delete tour (guide only, own tours)
export const deleteTour = async (req, res) => {
  try {
    const { tourID } = req.params;
    const guideID = req.user.userID;

    await tourModel.deleteTour(tourID, guideID);

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting tour'
    });
  }
};

// Get guide's tours
export const getGuideTours = async (req, res) => {
  try {
    const guideID = req.user.userID;
    const { page, limit } = req.query;

    const filters = {
      guideID,
      page: page || 1,
      limit: limit || 10
    };

    const result = await tourModel.searchTours(filters);

    res.json({
      success: true,
      data: result.tours,
      pagination: result.pagination,
      message: `Found ${result.pagination.total} tours`
    });
  } catch (error) {
    console.error('Error fetching guide tours:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your tours'
    });
  }
};