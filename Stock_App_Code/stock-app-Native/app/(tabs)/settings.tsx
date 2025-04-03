import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Settings</Text>
      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
        Customize your app experience.
      </Text>

      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
        Light/Dark Mode
      </Text>
      <Button title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} onPress={toggleTheme} />

      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>FAQ</Text>
      <Text style={isDarkMode && styles.darkText}>If there is a problem loading a stock?</Text>
      <Text style={isDarkMode && styles.darkText}>
        There is a window where it resets, so be patient and try again in three minutes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  light: {
    backgroundColor: "#fff",
  },
  dark: {
    backgroundColor: "#121212",
  },
  darkText: {
    color: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
});
