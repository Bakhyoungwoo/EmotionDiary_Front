import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { signup } from "../../authService";

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !pw || !pwConfirm) {
      setMsg("⚠ 모든 필드를 입력해주세요");
      return;
    }
    if (pw !== pwConfirm) {
      setMsg("❌ 비밀번호가 일치하지 않습니다");
      return;
    }
    if (pw.length < 6) {
      setMsg("❌ 비밀번호는 최소 6자 이상이어야 합니다");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await signup(email, pw);
      const userEmail = (res as any)?.user?.email || email;
      setMsg("✅ 회원가입 성공: " + userEmail);
      navigation.goBack(); // 회원가입 성공 → 로그인 화면으로 이동
    } catch (err: any) {
      console.error("Signup Error:", err.response?.data || err.message);
      const detail = err.response?.data?.detail;
      const errorMsg =
        typeof detail === "string"
          ? detail
          : detail?.msg || detail?.error_description || "회원가입 실패";
      setMsg("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

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
      <TextInput
        placeholder="비밀번호를 한 번 더 입력해주세요"
        placeholderTextColor="#666"
        secureTextEntry
        style={styles.input}
        value={pwConfirm}
        onChangeText={setPwConfirm}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>회원가입</Text>
        )}
      </TouchableOpacity>

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
    color: "#000",
  },
  button: {
    backgroundColor: "#4B7BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  msg: { marginTop: 20, textAlign: "center", color: "#000" },
});
