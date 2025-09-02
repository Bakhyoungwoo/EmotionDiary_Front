import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { signup } from "../authService";

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async () => {
    if (pw !== pwConfirm) {
      setMsg("❌ 비밀번호가 일치하지 않습니다");
      return;
    }
    try {
      const res = await signup(email, pw);
      setMsg("✅ 회원가입 성공: " + res.user.email);
      navigation.goBack(); // 회원가입 성공 → 로그인 화면으로 이동
    } catch (err: any) {
      setMsg("❌ 회원가입 실패: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

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
      <TextInput
        placeholder="비밀번호를 한 번 더 입력해주세요"
        secureTextEntry
        style={styles.input}
        value={pwConfirm}
        onChangeText={setPwConfirm}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>

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
});
