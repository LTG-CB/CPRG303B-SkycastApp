import React from 'react';
import { View, Text } from 'react-native';

// Define the Props interface for the component
interface Props {
  weatherData: Record<string, any>; // Weather data object, where keys are data fields and values are their corresponding values
  preferences: Record<string, boolean>; // User preferences, where keys are fields to display and values determine whether to display them
}

// The WeatherDisplay component
export default function WeatherDisplay({ weatherData, preferences }: Props) {
  return (
    <View>
      {/* Iterate over the keys in the preferences object */}
      {Object.keys(preferences).map(
        (key) =>
          preferences[key] && ( // Check if the preference is enabled (true)
            <Text key={key}>
              {/* Display the preference name (key) and its corresponding weather data */}
              {key}: {weatherData[key] ?? 'N/A'} {/* Fallback to 'N/A' if data for the key is undefined */}
            </Text>
          )
      )}
    </View>
  );
}
