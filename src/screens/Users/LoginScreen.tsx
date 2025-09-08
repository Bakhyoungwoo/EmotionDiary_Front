import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../authService";
import { LoginResponse } from "../../types";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pw) {
      setMsg("⚠ 이메일과 비밀번호를 입력해주세요");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res: LoginResponse = await login(email, pw);

      // 토큰 저장
      await AsyncStorage.multiSet([
        ["access_token", res.access_token],
        ["refresh_token", res.refresh_token],
      ]);

      setMsg("✅ 로그인 성공");
      navigation.replace("Home"); // 로그인 성공 → Home 화면으로 이동
    } catch (err: any) {
      console.error("Login Error:", err.response?.data || err.message);
      const detail = err.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : detail?.msg || detail?.error_description || "로그인 실패";
      setMsg("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <TextInput
        placeholder="이메일을 입력해주세요"
        placeholderTextColor="#666"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="비밀번호를 입력해주세요"
        placeholderTextColor="#666"
        secureTextEntry
        style={styles.input}
        value={pw}
        onChangeText={setPw}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>로그인</Text>
        )}
      </TouchableOpacity>

      <View style={styles.linkRow}>
        <Text style={styles.link}>PW 찾기</Text>
        <Text style={styles.separator}> | </Text>
        <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
          회원가입
        </Text>
      </View>

      {msg ? <Text style={styles.msg}>{msg}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 30, color: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 12,
    color: "#000", // 입력 텍스트 색상
  },
  button: {
    backgroundColor: "#4B7BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  linkRow: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  link: { color: "#333" },
  separator: { color: "#999", marginHorizontal: 5 },
  msg: { marginTop: 20, textAlign: "center", color: "#000" },
});
