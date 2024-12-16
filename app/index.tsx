import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import LocationInput from './src/components/LocationInput';
import PreferencesToggles from './src/components/PreferencesToggles';
import WeatherDisplay from './src/components/WeatherDisplay';
import { fetchCoordinates } from './src/services/geocodingService';
import { fetchWeather } from './src/services/weatherService';
import { saveLocation, getLocation, savePreferences, getPreferences } from './src/storage/userStorage';
import { PreferenceKeys } from './src/types';

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
  const [location, setLocation] = useState<string>('');
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [weatherData, setWeatherData] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadData = async () => {
      const savedLocation = await getLocation();
      const savedPreferences = await getPreferences();
      if (savedLocation) setLocation(savedLocation);
      if (savedPreferences) setPreferences(savedPreferences);
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (location) {
        try {
          const { latitude, longitude } = await fetchCoordinates(location);
          const weather = await fetchWeather(latitude, longitude, preferences); // Pass preferences
          setWeatherData(weather);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };
    fetchWeatherData();
  }, [location]);
  
  const handleLocationChange = async (newLocation: string) => {
    try {
      setLocation(newLocation); // Update the location state
      await saveLocation(newLocation); // Save the location in storage
  
      // Fetch coordinates and weather data immediately after saving
      const { latitude, longitude } = await fetchCoordinates(newLocation);
      const weather = await fetchWeather(latitude, longitude, preferences); // Pass user preferences
      setWeatherData(weather); // Update the weather data state
    } catch (error) {
      console.error('Error updating location and fetching weather data:', error);
      alert('Failed to fetch weather data. Please check your input or try again.');
    }
  };

  const handleTogglePreference = (key: PreferenceKeys) => {
    const updatedPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(updatedPreferences);
    savePreferences(updatedPreferences);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
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
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50,
  },
});
