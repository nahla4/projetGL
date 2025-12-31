// Calculate tour price based on duration and guide's rates
export const calculatePrice = (duration, guidePricing) => {
  const { price_halfDay, price_fullDay, price_extraHour } = guidePricing;

  if (duration <= 4) {
    return parseFloat(price_halfDay);
  } else if (duration <= 8) {
    return parseFloat(price_fullDay);
  } else {
    const extraHours = duration - 8;
    return parseFloat(price_fullDay) + extraHours * parseFloat(price_extraHour);
  }
};