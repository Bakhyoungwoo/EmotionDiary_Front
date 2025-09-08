import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "../../authService";

export default function RefreshScreen() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    setMsg("");

    try {
      const old_refresh = await AsyncStorage.getItem("refresh_token");
      if (!old_refresh) {
        setMsg("❌ 저장된 refresh_token 없음");
        return;
      }

      const res = await refreshToken(old_refresh);

      // 새 access_token과 refresh_token을 저장 (둘 다 오는 경우)
      const newTokens: [string, string][] = [["access_token", res.access_token]];
      if (res.refresh_token) {
        newTokens.push(["refresh_token", res.refresh_token]);
      }
      await AsyncStorage.multiSet(newTokens);

      setMsg("✅ 토큰 갱신 성공");
    } catch (err: any) {
      console.error("Refresh Error:", err.response?.data || err.message);
      const detail = err.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : detail?.msg || detail?.error_description || "토큰 갱신 실패";
      setMsg("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleRefresh}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>토큰 갱신</Text>
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
