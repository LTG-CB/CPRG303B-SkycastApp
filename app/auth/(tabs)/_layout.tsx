import React from "react";
import { StyleSheet } from "react-native";
import { Drawer } from "expo-router/drawer";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CustomerDrawerContent from "@/components/CustomerDrawerContent";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomerDrawerContent {...props} />}>
        <Drawer.Screen
          name="current"
          options={{
            drawerLabel: "Current",
            headerTitle: "Current",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="sunny-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="forecast"
          options={{
            drawerLabel: "Forecast",
            headerTitle: "Forecast",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="snow-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            drawerLabel: "History",
            headerTitle: "History",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="umbrella-outline" color={color} size={size} />
            ),
          }}
        />        
        <Drawer.Screen
          name="suggestion"
          options={{
            drawerLabel: "Suggestion",
            headerTitle: "Suggestion",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="rocket-outline" color={color} size={size} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  drawerHeader: {
    height: 200,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
    nameText: {
    marginTop: 10,
    fontSize: 18,
  },
});
