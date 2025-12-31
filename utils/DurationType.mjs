// Get duration type (half-day, one-day, multi-day)
export const getDurationType = (duration) => {
  if (duration <= 4) return 'half-day';
  if (duration <= 8) return 'one-day';
  return 'multi-day';
};