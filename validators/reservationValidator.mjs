import { body, param } from 'express-validator';

// Validation for creating a reservation
export const validateReservationCreation = [
  body('tourID')
    .isInt({ min: 1 }).withMessage('Valid tour ID is required')
    .toInt(),

  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be in ISO 8601 format (YYYY-MM-DD HH:MM:SS)')
    .toDate()
    .custom((value) => {
      const now = new Date();
      const startDate = new Date(value);
      
      if (startDate < now) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),

  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('End date must be in ISO 8601 format (YYYY-MM-DD HH:MM:SS)')
    .toDate()
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  body('numberOfPeople')
    .isInt({ min: 1, max: 50 }).withMessage('Number of people must be between 1 and 50')
    .toInt()
];

// Validation for updating reservation status (guide)
export const validateReservationStatusUpdate = [
  param('reservationID')
    .isInt({ min: 1 }).withMessage('Invalid reservation ID')
    .toInt(),

  body('status')
    .isIn(['confirmed', 'cancelled', 'reschedule_requested'])
    .withMessage('Status must be one of: confirmed, cancelled, reschedule_requested'),

  body('suggestedStartDate')
    .optional()
    .isISO8601().withMessage('Suggested start date must be in ISO 8601 format (YYYY-MM-DD HH:MM:SS)')
    .toDate()
    .custom((value) => {
      const now = new Date();
      const suggestedDate = new Date(value);
      
      if (suggestedDate < now) {
        throw new Error('Suggested start date cannot be in the past');
      }
      return true;
    }),

  body('suggestedEndDate')
    .optional()
    .isISO8601().withMessage('Suggested end date must be in ISO 8601 format (YYYY-MM-DD HH:MM:SS)')
    .toDate()
    .custom((value, { req }) => {
      if (req.body.suggestedStartDate) {
        const startDate = new Date(req.body.suggestedStartDate);
        const endDate = new Date(value);
        
        if (endDate <= startDate) {
          throw new Error('Suggested end date must be after suggested start date');
        }
      }
      return true;
    }),

  // Custom validation: if status is reschedule_requested, suggested dates are required
  body().custom((body) => {
    if (body.status === 'reschedule_requested') {
      if (!body.suggestedStartDate || !body.suggestedEndDate) {
        throw new Error('Suggested dates are required when requesting reschedule');
      }
    }
    return true;
  })
];