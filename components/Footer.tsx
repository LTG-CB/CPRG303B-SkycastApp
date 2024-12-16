import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Footer = () => {
  return (
    <View>
      <Text style={styles.footer}>Designed by The innovators for CPRG303</Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    bottom: 15,
  },
});
