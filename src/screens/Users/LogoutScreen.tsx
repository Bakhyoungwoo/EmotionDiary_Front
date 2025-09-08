import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../authService";

export default function LogoutScreen({ navigation }: any) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setMsg("");

    try {
      const [access_token, refresh_token] = await Promise.all([
        AsyncStorage.getItem("access_token"),
        AsyncStorage.getItem("refresh_token"),
      ]);

      if (!refresh_token || !access_token) {
        setMsg("❌ 저장된 토큰 없음");
        return;
      }

      await logout(access_token, refresh_token);

      // 토큰 삭제
      await AsyncStorage.multiRemove(["access_token", "refresh_token"]);

      setMsg("✅ 로그아웃 성공");
      navigation.replace("Login"); // 로그아웃 후 로그인 화면으로 이동
    } catch (err: any) {
      console.error("Logout Error:", err.response?.data || err.message);
      const detail = err.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : detail?.msg || detail?.error_description || "로그아웃 실패";
      setMsg("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>로그아웃</Text>
        )}
      </TouchableOpacity>
      {msg ? <Text style={styles.msg}>{msg}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  button: {
    backgroundColor: "#4B7BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  msg: { marginTop: 20, textAlign: "center", color: "#000" },
});
