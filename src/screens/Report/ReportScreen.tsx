import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import API from "../../api"; // ✅ axios 인스턴스 (baseURL 설정된 것 사용)

interface EmotionSummary {
  emotion: string;
  cnt: number;
  percent: number;
}

interface EmotionTrend {
  day: string;
  emotion: string;
  cnt: number;
}

interface WeeklyTrend {
  labels: string[];
  scores: (number | null)[];
  emotions: (string | null)[];
}

interface ReportResponse {
  summary: EmotionSummary[];
  trend: EmotionTrend[];
  weekly: WeeklyTrend;
}

// ✅ 영문 감정 키 → 한글 라벨 매핑
const emotionLabels: Record<string, string> = {
  happy: "행복",
  sad: "슬픔",
  angry: "분노",
  anxious: "불안",
  neutral: "중립",
};

export default function ReportScreen() {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get<ReportResponse>("/report/summary?user_id=88a0e640-b167-437c-b70d-cf50f51c63d9");
        console.log("📌 API 응답:", res.data);
        setReport(res.data);
      } catch (err: any) {
        console.error("❌ 리포트 불러오기 실패:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  useEffect(() => {
    if (report) {
      console.log("📊 Summary 데이터:", report.summary);
      console.log("📈 Weekly 데이터:", report.weekly);
    }
  }, [report]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4B7BFF" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>리포트를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 감정 리포트</Text>

      {/* ✅ 1. 감정 분포 (PieChart) */}
      <Text style={styles.subtitle}>전체 감정 분포</Text>
      {report.summary.length > 0 ? (
        <PieChart
          data={report.summary.map((s, idx) => ({
            name: emotionLabels[s.emotion] ?? s.emotion, // ✅ 한글 변환
            population: s.cnt,
            color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][idx % 5],
            legendFontColor: "#333",
            legendFontSize: 14,
          }))}
          width={Dimensions.get("window").width - 20}
          height={220}
          chartConfig={{
            color: () => "#000",
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"10"}
          absolute
        />
      ) : (
        <Text style={styles.text}>데이터 없음</Text>
      )}

      {/* ✅ 2. 최근 7일 대표 감정 추이 (LineChart) */}
      <Text style={styles.subtitle}>최근 7일 대표 감정 추이</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: report.weekly.labels,
            datasets: [{ data: report.weekly.scores.map((s) => s ?? 0) }],
          }}
          width={Math.max(
            report.weekly.labels.length * 80,
            Dimensions.get("window").width
          )}
          height={220}
          fromZero
          yAxisSuffix="점"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(75, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: { r: "5", strokeWidth: "2", stroke: "#4B7BFF" },
          }}
          bezier
          style={{ marginVertical: 20, borderRadius: 16 }}
        />
      </ScrollView>

      {/* ✅ 3. 요약 텍스트 */}
      <Text style={styles.subtitle}>일자별 대표 감정</Text>
      {report.weekly.labels.map((day, idx) => (
        <Text key={day} style={styles.text}>
          {day}:{" "}
          {report.weekly.emotions[idx]
            ? emotionLabels[report.weekly.emotions[idx]!] ?? report.weekly.emotions[idx]
            : "데이터 없음"}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  text: { fontSize: 14, color: "#333", marginBottom: 5 },
});
