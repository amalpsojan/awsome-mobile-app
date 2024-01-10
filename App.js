import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ThemeProvider, useTheme } from "@shared-packages/mobile-theme";

const App = () => {
  const { colors, dark } = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundColor }]}
    >
      <Text
        style={[
          {
            color: colors.primaryTextColor,
            backgroundColor: colors.primaryColor,
          },
        ]}
      >
        Open up App.js to start working on your app!
        {"\n"} isDark Mode: {dark ? "yes" : "no"}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
