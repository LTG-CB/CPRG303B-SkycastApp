import axios from 'axios';

// Base URL for the weather API
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch weather data for a given latitude and longitude based on user preferences.
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @param preferences - Object representing user preferences for weather data (key-value pairs where keys are parameters and values are booleans)
 * @returns The daily weather data for the specified location
 * @throws Will throw an error if no preferences are selected or if the API call fails
 */
export const fetchWeather = async (
  latitude: number, // Latitude of the location
  longitude: number, // Longitude of the location
  preferences: Record<string, boolean> // User-selected preferences as a record of keys (parameters) and boolean values
) => {
  try {
    const dailyParams = [];
    if (preferences.maxTemperature) dailyParams.push('temperature_2m_max');
    if (preferences.minTemperature) dailyParams.push('temperature_2m_min');
    if (preferences.apparentMaxTemperature) dailyParams.push('apparent_temperature_max');
    if (preferences.apparentMinTemperature) dailyParams.push('apparent_temperature_min');
    if (preferences.precipitation) dailyParams.push('precipitation_sum');
    if (preferences.rain) dailyParams.push('rain_sum');
    if (preferences.snowfall) dailyParams.push('snowfall_sum');
    if (preferences.windSpeed) dailyParams.push('windspeed_10m_max');
    if (preferences.windGusts) dailyParams.push('windgusts_10m_max');
    if (preferences.weatherCode) dailyParams.push('weathercode');

    const params = {
      latitude,
      longitude,
      daily: dailyParams.join(','),
      forecast_days: 1,
      timezone: 'auto',
    };

    const response = await axios.get(WEATHER_BASE_URL, { params });

    console.log('Weather API response:', response.data);

    return response.data;

  } catch (error) {
    // Log the error to the console and rethrow it
    console.error('Error fetching weather:', error);
    throw error;
  }
};