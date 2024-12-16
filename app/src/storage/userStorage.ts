import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_KEY = 'user_location'; // Key to store user location
const PREFERENCES_KEY = 'user_preferences'; // Key to store user preferences

// Save user location to AsyncStorage
export const saveLocation = async (location: string) => {
  try {
    await AsyncStorage.setItem(LOCATION_KEY, location);
  } catch (error) {
    console.error('Error saving location:', error);
  }
};

// Retrieve user location from AsyncStorage
export const getLocation = async () => {
  try {
    return await AsyncStorage.getItem(LOCATION_KEY);
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};

// Save user preferences to AsyncStorage
export const savePreferences = async (preferences: Record<string, boolean>) => {
  try {
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

// Retrieve user preferences from AsyncStorage
export const getPreferences = async () => {
  try {
    const data = await AsyncStorage.getItem(PREFERENCES_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return null;
  }
};
