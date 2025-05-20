import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

interface LoadingSpinnerCountdownProps {
  initialCount?: number; // Số giây ban đầu (mặc định là 5)
  onFinish?: () => void; // Hàm callback sau khi đếm ngược kết thúc
}

const LoadingSpinnerCountdown: React.FC<LoadingSpinnerCountdownProps> = ({
  initialCount = 5,
  onFinish,
}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer); // Dọn dẹp timer
    } else {
      onFinish?.(); // Gọi hàm callback khi hoàn thành
    }
  }, [count, onFinish]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007BFF" />
      <Text style={styles.text}>Loading... {count}s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
});

export default LoadingSpinnerCountdown;
