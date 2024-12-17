import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

// Define the Props interface for the component
interface Props {
  preferences: Record<string, boolean>;
  onToggle: (key: string) => void;
}

const PreferencesToggles: React.FC<Props> = ({ preferences, onToggle }) => {
  const preferenceLabels: Record<string, string> = {
    maxTemperature: "Max Temperature",
    minTemperature: "Min Temperature",
    apparentMaxTemperature: "Apparent Max Temperature",
    apparentMinTemperature: "Apparent Min Temperature",
    precipitation: "Precipitation",
    rain: "Rain",
    snowfall: "Snowfall",
    windSpeed: "Wind Speed",
    windGusts: "Wind Gusts",
    weatherCode: "Weather Code",
  };

  return (
    <View>
      {Object.entries(preferences).map(([key, value]) => (
        <View key={key} style={styles.toggleContainer}>
          <Text style={styles.label}>{preferenceLabels[key]}</Text>
          <Switch
            value={value}
            onValueChange={() => onToggle(key)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={value ? "#f5dd4b" : "#f4f3f4"}

          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    color: "black",
    fontSize: 16,
  },
});

export default PreferencesToggles;