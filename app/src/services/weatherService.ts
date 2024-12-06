import axios from 'axios';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch weather data for a given latitude and longitude based on user preferences.
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @param preferences - User preferences for weather data
 * @returns Weather data for the specified location
 */
export const fetchWeather = async (
  latitude: number,
  longitude: number,
  preferences: Record<string, boolean>
) => {
  try {
    // Get the list of keys that are toggled on in preferences
    const selectedParameters = Object.keys(preferences)
      .filter((key) => preferences[key]) // Include only toggled-on keys
      .join(',');

    // Check if at least one parameter is selected
    if (!selectedParameters) {
      throw new Error('No parameters selected for weather data.');
    }

    // Make the API call with dynamically selected parameters
    const response = await axios.get(WEATHER_BASE_URL, {
      params: {
        latitude,
        longitude,
        daily: selectedParameters, // Use selected parameters in the API call
        forecast_days: 1,
        timezone: 'auto',
      },
    });

    return response.data.daily;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};
