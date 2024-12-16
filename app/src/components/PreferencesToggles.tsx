import React from 'react';
import { View, Text, Switch } from 'react-native';
import { PreferenceKeys } from '../types';

// Define the Props interface for the component
interface Props {
  preferences: Record<PreferenceKeys, boolean>; // Object storing user preferences as key-value pairs
  onToggle: (key: PreferenceKeys) => void; // Function to toggle a preference, passed as a prop
}

// The PreferencesToggles component
export default function PreferencesToggles({ preferences, onToggle }: Props) {
  return (
    <View>
      {/* Loop through the keys in the preferences object */}
      {Object.keys(preferences).map((key) => (
        <View 
          key={key} // Use the preference key as the unique identifier for the view
          style={{ flexDirection: 'row', alignItems: 'center' }} // Arrange items horizontally with alignment
        >
          {/* Display the preference name */}
          <Text>{key}</Text>

          {/* Switch component to toggle the preference */}
          <Switch
            value={preferences[key as PreferenceKeys]} // Bind the preference's value to the switch
            onValueChange={() => onToggle(key as PreferenceKeys)} // Call onToggle when the switch is toggled
          />
        </View>
      ))}
    </View>
  );
}
