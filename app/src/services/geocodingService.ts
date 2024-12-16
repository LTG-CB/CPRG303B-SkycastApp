import axios from 'axios';

// Base URL for the geocoding API
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Fetch the latitude and longitude for a given city name.
 * @param city - Name of the city to retrieve coordinates for
 * @returns An object containing { latitude, longitude } of the city
 * @throws Will throw an error if the city is not found or if the API call fails
 */
export const fetchCoordinates = async (city: string) => {
  try {
    // Make a GET request to the geocoding API with the city name as a parameter
    const response = await axios.get(GEOCODING_BASE_URL, {
      params: {
        name: city, // Name of the city
        count: 1, // Limit the response to one result
        language: 'en', // Language for the response
        format: 'json', // Response format
      },
    });

    // Validate if the API response contains results
    if (response.data.results && response.data.results.length > 0) {
      // Extract latitude and longitude from the first result
      const { latitude, longitude } = response.data.results[0];
      return { latitude, longitude }; // Return the coordinates as an object
    }

    // If no results are found, throw an error
    throw new Error('City not found');
  } catch (error) {
    // Log and rethrow any errors encountered during the API call
    console.error('Error fetching coordinates:', error);
    throw error;
  }
};
