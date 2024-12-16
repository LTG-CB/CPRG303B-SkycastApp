import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

// Define the Props interface for the component
interface Props {
  location: string; // Current location of the user, passed as a prop
  onLocationChange: (location: string) => void; // Function to update the user's location, passed as a prop
}

// The LocationInput component
export default function LocationInput({ location, onLocationChange }: Props) {
  // Local state to manage the input value for the TextInput component
  const [input, setInput] = useState(location); 

  return (
    <View>
      {/* Display the current location, or 'Not set' if no location is provided */}
      <Text>Current Location: {location || 'Not set'}</Text>

      {/* Input field for the user to enter their city */}
      <TextInput
        placeholder="Enter your city" // Placeholder text shown when input is empty
        value={input} // Bind the input state to the TextInput value
        onChangeText={setInput} // Update the input state whenever the text changes
      />

      {/* Button to save the entered location */}
      <Button 
        title="Save Location" // Text displayed on the button
        onPress={() => onLocationChange(input)} // Call onLocationChange with the current input when pressed
      />
    </View>
  );
}
