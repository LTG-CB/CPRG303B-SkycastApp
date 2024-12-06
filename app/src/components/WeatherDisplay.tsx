import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  weatherData: Record<string, any>; // Weather data object
  preferences: Record<string, boolean>; // User preferences to determine what to display
}

export default function WeatherDisplay({ weatherData, preferences }: Props) {
  return (
    <View>
      {/* Loop through preferences and display only the selected weather data */}
      {Object.keys(preferences).map(
        (key) =>
          preferences[key] && (
            <Text key={key}>
              {key}: {weatherData[key]} {/* Show weather data for this preference */}
            </Text>
          )
      )}
    </View>
  );
}
