import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type EmotionShapeRoute = RouteProp<
  { params: { distribution: Record<string, number> } },
  "params"
>;

export default function EmotionShapeScreen() {
  const route = useRoute<EmotionShapeRoute>();
  const { distribution } = route.params;

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // 정규화된 감정 분포 (합 = 100%)
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  const normalized = Object.entries(distribution).map(([key, value]) => ({
    emotion: key,
    percent: (value / total) * 100,
  }));

  // 가장 큰 감정 (중앙)
  const sorted = [...normalized].sort((a, b) => b.percent - a.percent);
  const center = sorted[0];
  const others = sorted.slice(1);

  const centerX = screenWidth / 2;
  const centerY = screenHeight / 2.2; // 중앙 살짝 위쪽에 배치

  // 색상 팔레트
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 감정 분포 도형 시각화</Text>

      <View style={styles.shapeContainer}>
        {/* 중앙 원 */}
        <View
          style={[
            styles.circle,
            {
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "#4B7BFF",
              top: centerY - 80,
              left: centerX - 80,
            },
          ]}
        >
          <Text style={styles.circleText}>
            {center.emotion} {"\n"}
            {center.percent.toFixed(1)}%
          </Text>
        </View>

        {/* 주변 원 */}
        {others.map((item, i) => {
          const size = 60 + item.percent; // 퍼센트에 따라 크기 가변
          const radius = 130; // 중심에서 떨어진 거리
          const angle = (i / others.length) * 2 * Math.PI; // 원형 배치

          const x = centerX + Math.cos(angle) * radius - size / 2;
          const y = centerY + Math.sin(angle) * radius - size / 2;

          return (
            <View
              key={i}
              style={[
                styles.circle,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: colors[i % colors.length],
                  top: y,
                  left: x,
                },
              ]}
            >
              <Text style={styles.circleText}>
                {item.emotion} {"\n"}
                {item.percent.toFixed(1)}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#000" },
  shapeContainer: {
    flex: 1,
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    padding: 4,
  },
  circleText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
});
