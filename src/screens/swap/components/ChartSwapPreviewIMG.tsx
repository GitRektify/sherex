import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, ImageStyle } from "react-native";

import CloseIcon from "@/assets/svg/close.svg"; // Đảm bảo bạn có component SVG phù hợp

const ChartSwapPreviewIMG = ({ item }) => {
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [color, setColor] = useState("red");

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsMouseEnter(!isMouseEnter)}
        style={styles.imageWrapper}
      >
        <Image source={item} style={styles.image as ImageStyle} />
        {isMouseEnter && (
          <View style={styles.iconOverlay}>
            <CloseIcon color={color} />
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.text}>0 ADA</Text>
        <View style={styles.line} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  imageWrapper: {
    backgroundColor: "#88919e",
    borderRadius: 50,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 50,
  },
  iconOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  textContainer: {
    flexDirection: "column",
    gap: 4,
  },
  text: {
    color: "#88919e",
    fontSize: 12,
    fontWeight: "500",
  },
  line: {
    backgroundColor: "#88919e",
    height: 3,
    width: 60,
  },
});

export default ChartSwapPreviewIMG;
