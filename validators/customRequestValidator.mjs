import { body } from 'express-validator';

// Validation for creating a custom request
export const validateCustomRequestCreation = [
  body('requestedCityID')
    .isInt({ min: 1 }).withMessage('Valid city ID is required')
    .toInt(),

  body('gps_latitude')
    .optional()
    .isFloat({ min: 18.0, max: 38.0 }).withMessage('Invalid GPS latitude for Algeria')
    .toFloat(),

  body('gps_longitude')
    .optional()
    .isFloat({ min: -9.0, max: 12.0 }).withMessage('Invalid GPS longitude for Algeria')
    .toFloat(),

  body('startDate')
    .isISO8601().withMessage('Start date must be in ISO 8601 format (YYYY-MM-DD)')
    .toDate()
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startDate = new Date(value);
      startDate.setHours(0, 0, 0, 0);

      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),

  body('endDate')
    .isISO8601().withMessage('End date must be in ISO 8601 format (YYYY-MM-DD)')
    .toDate()
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);

      if (endDate < startDate) {
        throw new Error('End date must be after or equal to start date');
      }
      return true;
    }),

  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20 and 1000 characters')
];
