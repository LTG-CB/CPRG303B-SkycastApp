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
    // Extract the keys from the preferences object where the value is true (toggled on)
    const selectedParameters = Object.keys(preferences)
      .filter((key) => preferences[key]) // Filter out the preferences that are not selected (false)
      .join(','); // Join the selected keys into a comma-separated string for the API

    // Validate that at least one parameter has been selected
    if (!selectedParameters) {
      throw new Error('No parameters selected for weather data.');
    }

    // Make the API call with the selected parameters
    const response = await axios.get(WEATHER_BASE_URL, {
      params: {
        latitude, // Latitude of the location
        longitude, // Longitude of the location
        daily: selectedParameters, // Comma-separated list of selected parameters
        forecast_days: 1, // Request data for one day
        timezone: 'auto', // Automatically adjust the timezone based on location
      },
    });

    // Return the daily weather data from the API response
    return response.data.daily;
  } catch (error) {
    // Log the error to the console and rethrow it
    console.error('Error fetching weather:', error);
    throw error;
  }
};
