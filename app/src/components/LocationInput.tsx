import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

// Define the Props interface for the component
interface Props {

  location: string; // Current location of the user, passed as a prop
  onLocationChange: (location: string) => void; // Function to update the user's location, passed as a prop
}

// The LocationInput component
export default function LocationInput({ location, onLocationChange }: Props) {
  const [input, setInput] = useState(location);

  const handleInputChange = (text: string) => {
    setInput(text);
    onLocationChange(text); // Update parent component's state immediately
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your city"
        value={input}
        onChangeText={handleInputChange}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%', // Adjust width as needed
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
});