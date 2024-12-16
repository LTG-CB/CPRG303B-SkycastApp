import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_KEY = 'user_location'; // Key to store user location
const PREFERENCES_KEY = 'user_preferences'; // Key to store user preferences

// Save user location to AsyncStorage
export const saveLocation = async (location: string) => {
  try {
    await AsyncStorage.setItem(LOCATION_KEY, location); // Save the location string
  } catch (error) {
    console.error('Error saving location:', error); // Log any error that occurs
  }
};

// Retrieve user location from AsyncStorage
export const getLocation = async () => {
  try {
    return await AsyncStorage.getItem(LOCATION_KEY); // Retrieve the stored location string
  } catch (error) {
    console.error('Error fetching location:', error); // Log any error that occurs
    return null; // Return null if an error occurs
  }
};

// Save user preferences to AsyncStorage
export const savePreferences = async (preferences: Record<string, boolean>) => {
  try {
    const serializedPreferences = JSON.stringify(preferences); // Convert the preferences object to a JSON string
    await AsyncStorage.setItem(PREFERENCES_KEY, serializedPreferences); // Save the serialized string
  } catch (error) {
    console.error('Error saving preferences:', error); // Log any error that occurs
  }
};

// Retrieve user preferences from AsyncStorage
export const getPreferences = async () => {
  try {
    const data = await AsyncStorage.getItem(PREFERENCES_KEY); // Retrieve the stored preferences string
    return data ? JSON.parse(data) : {}; // Parse the string back into an object, return empty object if no data
  } catch (error) {
    console.error('Error fetching preferences:', error); // Log any error that occurs
    return {}; // Return an empty object if an error occurs
  }
};
