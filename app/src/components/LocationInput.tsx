import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

interface Props {
  location: string; // Current location of the user
  onLocationChange: (location: string) => void; // Function to update the user's location
}

export default function LocationInput({ location, onLocationChange }: Props) {
  const [input, setInput] = useState(location); // Local state to manage the input field

  return (
    <View>
      {/* Display the current location */}
      <Text>Current Location: {location || 'Not set'}</Text>
      {/* Input field for user to enter their city */}
      <TextInput
        placeholder="Enter your city"
        value={input}
        onChangeText={setInput}
      />
      {/* Button to save the input location */}
      <Button title="Save Location" onPress={() => onLocationChange(input)} />
    </View>
  );
}
