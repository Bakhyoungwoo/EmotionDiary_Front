// HomeScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Report")}
      >
        <Text style={styles.buttonText}>Report</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Diary")}
      >
        <Text style={styles.buttonText}>Diary</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 40 },
  button: {
    backgroundColor: "#4B7BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    width: 200,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
