import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import React, { useState } from "react";
import Footer from "@/components/Footer";

const suggestion = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = () => {
    if (!name || !email || !suggestion) {
      Alert.alert("Error", "All fields must be filled");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Invalid email format");
      return;
    }

    if (suggestion.length > 2000) {
      Alert.alert("Error", "Suggestion cannot exceed 2000 characters");
      return;
    }

    // Code to send email goes here
    // For example, using an email API or a backend service to handle the email sending
    Alert.alert("Success", "Your suggestion has been submitted");
    // Reset form
    setName("");
    setEmail("");
    setSuggestion("");
  };

  return (
    <View style={styles.container}>
      <Image
        blurRadius={1}
        // broken tried to fix but reverted to supplied file
        // source={require("C:/Users/wuiyi/CPRG303-project/assets/images/170617UP_20160918_010.jpg")}
        style={StyleSheet.flatten([styles.backgroundImage])}
      />
      <View style={styles.boxContainer}>
        <Text style={styles.title}>Suggestion Box</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.textArea}
          placeholder="Your Suggestion (Max 2000 characters)"
          value={suggestion}
          onChangeText={setSuggestion}
          multiline={true}
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
};

export default suggestion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  boxContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    shadowOpacity: 0.5,
    textShadowRadius: 5,
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    width: "100%",
    borderColor: "#bdc3c7",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    fontSize: 16,
    height: 100, // Fixed height for text area
  },
  button: {
    backgroundColor: "#37484F",
    borderColor: "#f5eac4",
    borderWidth: 1,
    paddingVertical: 15,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
});
