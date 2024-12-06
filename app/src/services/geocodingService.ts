import axios from 'axios';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Fetch the latitude and longitude for a given city name.
 * @param city - Name of the city
 * @returns {latitude, longitude} - Coordinates of the city
 */
export const fetchCoordinates = async (city: string) => {
  try {
    const response = await axios.get(GEOCODING_BASE_URL, {
      params: {
        name: city,
        count: 1,
        language: 'en',
        format: 'json',
      },
    });

    // Check if results are available
    if (response.data.results && response.data.results.length > 0) {
      const { latitude, longitude } = response.data.results[0];
      return { latitude, longitude };
    }
    throw new Error('City not found');
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
};
