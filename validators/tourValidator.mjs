import { body, param, query } from "express-validator";

// Validation for creating a tour
const validateTourCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 10, max: 200 })
    .withMessage("Title must be between 10 and 200 characters"),

  body("duration")
    .isFloat({ min: 0.5, max: 24 })
    .withMessage("Duration must be between 0.5 and 24 hours")
    .toFloat(),

  body("cityID")
    .isInt({ min: 1 })
    .withMessage("Valid city ID is required")
    .toInt(),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 50, max: 2000 })
    .withMessage("Description must be between 50 and 2000 characters"),

  body("meetingPoint")
    .trim()
    .notEmpty()
    .withMessage("Meeting point is required")
    .isLength({ max: 500 })
    .withMessage("Meeting point must be less than 500 characters"),

  body("gps_latitude")
    .isFloat({ min: 18.0, max: 38.0 })
    .withMessage("Invalid GPS latitude for Algeria")
    .toFloat(),

  body("gps_longitude")
    .isFloat({ min: -9.0, max: 12.0 })
    .withMessage("Invalid GPS longitude for Algeria")
    .toFloat(),

  body("photos")
    .optional()
    .isArray({ min: 1, max: 10 })
    .withMessage("Photos must be an array with 1-10 items"),

  body("photos.*")
    .optional()
    .isURL()
    .withMessage("Each photo must be a valid URL"),

  body("included")
    .optional()
    .isArray()
    .withMessage("Included items must be an array"),

  body("included.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Each included item must be 1-200 characters"),

  body("excluded")
    .optional()
    .isArray()
    .withMessage("Excluded items must be an array"),

  body("excluded.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Each excluded item must be 1-200 characters"),

  body("highlights")
    .optional()
    .isArray()
    .withMessage("Highlights must be an array"),

  body("highlights.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage("Each highlight must be 1-300 characters"),

  body("itinerary")
    .optional()
    .isArray()
    .withMessage("Itinerary must be an array"),

  body("itinerary.*.stepTime")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Step time must be in HH:MM format"),

  body("itinerary.*.details")
    .trim()
    .notEmpty()
    .withMessage("Each itinerary step must have details")
    .isLength({ min: 5, max: 500 })
    .withMessage("Step details must be 5-500 characters"),
];

// Validation for updating a tour
const validateTourUpdate = [
  param("tourID").isInt({ min: 1 }).withMessage("Invalid tour ID").toInt(),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("Title must be between 10 and 200 characters"),

  body("duration")
    .optional()
    .isFloat({ min: 0.5, max: 24 })
    .withMessage("Duration must be between 0.5 and 24 hours")
    .toFloat(),

  body("cityID")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Valid city ID is required")
    .toInt(),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage("Description must be between 50 and 2000 characters"),

  body("meetingPoint")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Meeting point must be less than 500 characters"),

  body("gps_latitude")
    .optional()
    .isFloat({ min: 18.0, max: 38.0 })
    .withMessage("Invalid GPS latitude for Algeria")
    .toFloat(),

  body("gps_longitude")
    .optional()
    .isFloat({ min: -9.0, max: 12.0 })
    .withMessage("Invalid GPS longitude for Algeria")
    .toFloat(),

  body("photos")
    .optional()
    .isArray({ min: 1, max: 10 })
    .withMessage("Photos must be an array with 1-10 items"),

  body("included")
    .optional()
    .isArray()
    .withMessage("Included items must be an array"),

  body("excluded")
    .optional()
    .isArray()
    .withMessage("Excluded items must be an array"),

  body("highlights")
    .optional()
    .isArray()
    .withMessage("Highlights must be an array"),

  body("itinerary")
    .optional()
    .isArray()
    .withMessage("Itinerary must be an array"),
];

export { validateTourCreation, validateTourUpdate };
