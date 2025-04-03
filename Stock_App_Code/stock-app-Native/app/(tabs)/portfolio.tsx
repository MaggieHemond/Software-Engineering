import { View, Text, StyleSheet } from 'react-native';
import { useThemeContext } from "@/context/ThemeContext";

export default function PortfolioScreen() {
  const { isDarkMode } = useThemeContext();

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Portfolio Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
