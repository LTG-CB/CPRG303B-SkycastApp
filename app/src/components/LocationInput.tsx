import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface Props {
  location: string;
  onLocationChange: (location: string) => void;
}

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