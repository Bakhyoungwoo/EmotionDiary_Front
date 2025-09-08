import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function StartScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* 이미지 자체를 버튼처럼 터치 가능하게 */}
      <TouchableOpacity
        style={styles.touchArea}
        onPress={() => navigation.replace("Login")} // 그림 누르면 Login 이동
        activeOpacity={0.8}
      >
        <Image
          source={require("../../../assets/Start/StartPage_image.png")}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  touchArea: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
