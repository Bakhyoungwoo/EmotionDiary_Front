import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../api"; // axios 인스턴스
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator"; // ✅ 네비게이터 타입

interface GenerateResponse {
  emotion: string;
  sentiment: string;
  message: string;
  saved: boolean;
  distribution?: Record<string, number>; // 감정 분포
}

// ✅ navigation 타입 지정
type DiaryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Diary"
>;

export default function DiaryScreen() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigation = useNavigation<DiaryScreenNavigationProp>();

  const handleSave = async () => {
  if (!text.trim()) {
    setMsg("⚠ 일기를 입력해주세요.");
    return;
  }

  setLoading(true);
  setMsg("");
  setResult(null);

  try {
    const access_token = await AsyncStorage.getItem("access_token");
    if (!access_token) {
      setMsg("❌ 로그인 토큰이 없습니다. 다시 로그인해주세요.");
      return;
    }

    const res = await API.post<GenerateResponse>(
      "/message/generate",
      { input_text: text },
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    // ✅ 응답 로그 찍기
    console.log("📌 API 응답 데이터:", res.data);

    setResult(res.data);
    setText("");
  } catch (err: any) {
    console.error("Diary Save Error:", err.response?.data || err.message);
    setMsg("❌ 실패: " + (err.response?.data?.detail || err.message));
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 일기</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="오늘 하루 있었던 일을 자유롭게 작성해보세요."
        placeholderTextColor="#666"
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>저장</Text>
        )}
      </TouchableOpacity>

      {msg ? <Text style={styles.msg}>{msg}</Text> : null}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>📊 감정 분석 결과</Text>
          <Text>감정: {result.emotion}</Text>
          <Text style={styles.quote}>💌 {result.message}</Text>

          {/* 👉 다음 버튼 (도형 시각화 화면으로 이동) */}
          {result.distribution && (
            <TouchableOpacity
              style={[
                styles.button,
                { marginTop: 15, backgroundColor: "#FF7B4B" },
              ]}
              onPress={() =>
                navigation.navigate("EmotionShape", {
                  distribution: result.distribution as Record<string, number>, // ✅ 단언 추가
                })
              }
            >
              <Text style={styles.buttonText}>다음 ➡</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
    color: "#000",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4B7BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  msg: { marginTop: 15, textAlign: "center", color: "#000" },
  resultBox: {
    marginTop: 25,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#F4F6FF",
  },
  resultTitle: { fontWeight: "bold", marginBottom: 10, fontSize: 16 },
  quote: { marginTop: 10, fontStyle: "italic", color: "#333" },
});
