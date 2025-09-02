import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "../authService";

export default function RefreshScreen() {
  const [msg, setMsg] = useState("");

  const handleRefresh = async () => {
    const refresh_token = await AsyncStorage.getItem("refresh_token");
    if (!refresh_token) {
      setMsg("❌ 저장된 refresh_token 없음");
      return;
    }
    try {
      const res = await refreshToken(refresh_token);
      await AsyncStorage.setItem("access_token", res.access_token);
      setMsg("✅ 토큰 갱신 성공");
    } catch (err: any) {
      setMsg("❌ 갱신 실패: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleRefresh}>
        <Text style={styles.buttonText}>토큰 갱신</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 20 }}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  button: { backgroundColor: "#4B7BFF", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
