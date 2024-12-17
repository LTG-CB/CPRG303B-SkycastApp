import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import LocationInput from './src/components/LocationInput';
import PreferencesToggles from './src/components/PreferencesToggles';
import WeatherDisplay from './src/components/WeatherDisplay';
import { fetchCoordinates } from './src/services/geocodingService';
import { fetchWeather } from './src/services/weatherService';
import { saveLocation, getLocation, savePreferences, getPreferences } from './src/storage/userStorage';
import { PreferenceKeys } from './src/types';

// Default preferences for the weather parameters
const defaultPreferences: Record<PreferenceKeys, boolean> = {
  weather_code: true,
  temperature_2m_max: true,
  temperature_2m_min: true,
  apparent_temperature_max: true,
  apparent_temperature_min: true,
  sunrise: true,
  sunset: true,
  daylight_duration: true,
  sunshine_duration: true,
  uv_index_max: true,
  precipitation_sum: true,
  rain_sum: true,
  showers_sum: true,
  snowfall_sum: true,
  precipitation_hours: true,
  precipitation_probability_max: true,
  wind_speed_10m_max: true,
  wind_gusts_10m_max: true,
  wind_direction_10m_dominant: true,
};

export default function App() {
  const [location, setLocation] = useState<string>(''); // Stores the user's location
  const [preferences, setPreferences] = useState(defaultPreferences); // Stores the user's preferences
  const [weatherData, setWeatherData] = useState<Record<string, any>>({}); // Stores the fetched weather data

  // Load saved location and preferences when the app starts
  useEffect(() => {
    const loadData = async () => {
      const savedLocation = await getLocation();
      const savedPreferences = await getPreferences();
      if (savedLocation) setLocation(savedLocation);
      if (savedPreferences) setPreferences(savedPreferences);
    };
    loadData();
  }, []);

  // Fetch weather data whenever the location changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (location) {
        try {
          const { latitude, longitude } = await fetchCoordinates(location); // Get coordinates for the location
          const weather = await fetchWeather(latitude, longitude, preferences); // Fetch weather data based on preferences
          setWeatherData(weather); // Update weather data state
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };
    fetchWeatherData();
  }, [location]);

  // Handle location input change and fetch updated weather data
  const handleLocationChange = async (newLocation: string) => {
    try {
      setLocation(newLocation); // Update the location state
      await saveLocation(newLocation); // Save the location to storage

      const { latitude, longitude } = await fetchCoordinates(newLocation); // Fetch coordinates
      const weather = await fetchWeather(latitude, longitude, preferences); // Fetch updated weather data
      setWeatherData(weather); // Update the weather data state
    } catch (error) {
      console.error('Error updating location and fetching weather data:', error);
      alert('Failed to fetch weather data. Please check your input or try again.'); // Alert the user if there's an issue
    }
  };

  // Toggle user preference for a specific weather parameter
  const handleTogglePreference = (key: PreferenceKeys) => {
    const updatedPreferences = {
      ...preferences,
      [key]: !preferences[key], // Toggle the preference
    };
    setPreferences(updatedPreferences); // Update preferences state
    savePreferences(updatedPreferences); // Save updated preferences to storage
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Adjust keyboard behavior for iOS
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled" // Allow dismissing keyboard by tapping
      >
        <LocationInput location={location} onLocationChange={handleLocationChange} />
        <PreferencesToggles preferences={preferences} onToggle={handleTogglePreference} />
        <WeatherDisplay weatherData={weatherData} preferences={preferences} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the view takes up the full screen
  },
  contentContainer: {
    flexGrow: 1, // Allows scrollable content to expand
    padding: 20, // Add padding around content
    paddingBottom: 50, // Add extra padding at the bottom
  },
});
