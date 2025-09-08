import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from "react-native";
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

export default function ReportScreen() {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get<ReportResponse>("/report/summary");
        setReport(res.data);
      } catch (err: any) {
        console.error("리포트 불러오기 실패:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

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
      <PieChart
        data={report.summary.map((s, idx) => ({
          name: s.emotion,
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

      {/* ✅ 2. 최근 7일 대표 감정 추이 (LineChart) */}
      <Text style={styles.subtitle}>최근 7일 대표 감정 추이</Text>
      <LineChart
        data={{
          labels: report.weekly.labels,
          datasets: [{ data: report.weekly.scores.map((s) => s ?? 0) }],
        }}
        width={Dimensions.get("window").width - 20}
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

      {/* ✅ 3. 요약 텍스트 */}
      <Text style={styles.subtitle}>일자별 대표 감정</Text>
      {report.weekly.labels.map((day, idx) => (
        <Text key={day} style={styles.text}>
          {day}: {report.weekly.emotions[idx] ?? "데이터 없음"}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#000", textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10, color: "#333" },
  text: { fontSize: 14, color: "#333", marginBottom: 5 },
});
