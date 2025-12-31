import 'dotenv/config';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const getForecast = async (lat, lon, dateString) => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key not found in environment variables');
  }
 
  try {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Filter forecasts for the specific date
    const targetDate = new Date(dateString);
    const targetDateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD

    const dayForecasts = data.list.filter(forecast => {
      const forecastDate = new Date(forecast.dt * 1000);
      const forecastDateStr = forecastDate.toISOString().split('T')[0];
      return forecastDateStr === targetDateStr;
    });

    if (dayForecasts.length === 0) {
      throw new Error('No weather forecast available for the specified date');
    }

    // Aggregate data for the day
    const temps = dayForecasts.map(f => f.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    const conditions = dayForecasts.map(f => f.weather[0].description);
    // Take the most common condition
    const condition = conditions.sort((a,b) =>
      conditions.filter(v => v===a).length - conditions.filter(v => v===b).length
    ).pop();

    const precipitationChances = dayForecasts.map(f => f.pop || 0);
    const maxPrecipitationChance = Math.max(...precipitationChances) * 100; // Convert to percentage

    const windSpeeds = dayForecasts.map(f => f.wind.speed);
    const avgWindSpeed = windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length;

    const humidities = dayForecasts.map(f => f.main.humidity);
    const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;

    // Wind direction - average direction in degrees
    const windDirections = dayForecasts.map(f => f.wind.deg);
    const avgWindDirection = windDirections.reduce((a, b) => a + b, 0) / windDirections.length;

    return {
      date: targetDateStr,
      temperature: {
        min: Math.round(minTemp),
        max: Math.round(maxTemp)
      },
      condition: condition,
      precipitationChance: Math.round(maxPrecipitationChance),
      wind: {
        speed: Math.round(avgWindSpeed * 10) / 10, // Round to 1 decimal
        direction: Math.round(avgWindDirection)
      },
      humidity: Math.round(avgHumidity)
    };

  } catch (error) {
    console.error('Weather service error:', error.message);
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

export default { getForecast };