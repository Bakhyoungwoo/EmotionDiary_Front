import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../authService";
import { LoginResponse } from "../types";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    try {
      const res: LoginResponse = await login(email, pw);
      await AsyncStorage.setItem("access_token", res.access_token);
      await AsyncStorage.setItem("refresh_token", res.refresh_token);
      setMsg("✅ 로그인 성공");
    } catch (err: any) {
      setMsg("❌ 로그인 실패: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <TextInput
        placeholder="이메일을 입력해주세요"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="비밀번호를 입력해주세요"
        secureTextEntry
        style={styles.input}
        value={pw}
        onChangeText={setPw}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.linkRow}>
        <Text style={styles.link}>PW 찾기</Text>
        <Text style={styles.separator}> | </Text>
        <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
          회원가입
        </Text>
      </View>

      <Text style={{ marginTop: 20 }}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#4B7BFF", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  linkRow: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  link: { color: "#333" },
  separator: { color: "#999", marginHorizontal: 5 },
});
