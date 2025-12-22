// utils/reservation.js

// Calculate duration in hours
const calculateDurationHours = (start, end) => {
  const diffMs = new Date(end) - new Date(start);
  return diffMs / (1000 * 60 * 60);
};

// Calculate amount based on hours
const calculateAmount = (hours, guide) => {
  if (hours <= 4) return guide.halfDayPrice;
  if (hours <= 8) return guide.fullDayPrice;

  return guide.fullDayPrice + (hours - 8) * guide.extraHourPrice;
};

module.exports = {
  calculateDurationHours,
  calculateAmount,
};
