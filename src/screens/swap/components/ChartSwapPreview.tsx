import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

import Down from "@/assets/svg/down.svg";
import ChartSwapPreviewIMG from "./ChartSwapPreviewIMG";
import CloseIcon from "@/assets/svg/close.svg";

// import {
//   ChartSwapImg1,
//   ChartSwapImg2,
//   ChartSwapImg3,
//   ChartSwapImg4,
//   ChartSwapImg5,
//   ChartSwapImg6,
// } from "../../common/IMG/Images";

const ChartSwapPreview = (props) => {
  const { isDetail, handleDetail } = props;
  const [color, setColor] = useState("yellow");
  const ImgData = [
    { ImgURL: 'https://storage.googleapis.com/dexhunter-images/public/minswap.png' },
    { ImgURL: 'https://storage.googleapis.com/dexhunter-images/public/spectrum.png' },
    { ImgURL: 'https://storage.googleapis.com/dexhunter-images/public/wingriders.png' },
    { ImgURL: 'https://storage.googleapis.com/dexhunter-images/public/sundae.png' },
    { ImgURL: 'https://storage.googleapis.com/dexhunter-images/public/vyfi.png' },
    { ImgURL: 'https://storage.googleapis.com/dexhunter-images/public/muesli.png' },
  ];

  return (
    <View style={styles.container}>
      {/* Swap Preview Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Swap Preview</Text>
        <TouchableOpacity onPress={() => handleDetail(isDetail)}>
          <CloseIcon />
        </TouchableOpacity>
      </View>
      
      {/* Swap Information Sections */}
      <View style={styles.sectionContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>Bonus Output</Text>
          <Text style={styles.value}>Direct Swap</Text>
          <Text style={styles.label}>Other Deposits</Text>
          <Text style={styles.value}>0 ADA</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Net price</Text>
          <Text style={styles.value}>Direct 0 ADA</Text>
          <Text style={styles.label}>Batchers fees</Text>
          <Text style={styles.value}>0 ADA</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Min. receive</Text>
          <Text style={styles.value}>0 AGIX</Text>
          <Text style={styles.label}>Frontend fee</Text>
          <Text style={styles.value}>0 ADA</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Image Buttons */}
      <View style={styles.imageContainer}>
        {ImgData.map((item, idx) => (
          <ChartSwapPreviewIMG key={'chart-swap-preview'+idx} item={item.ImgURL} />
        ))}
      </View>

      {/* Hide Button */}
      <TouchableOpacity
        style={styles.hideButton}
        onPress={() => handleDetail(isDetail)}
      >
        <Text style={styles.hideText}>HIDE</Text>
        <Down color={color} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121218",
    padding: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    flex: 1,
  },
  label: {
    color: "#88919e",
    fontSize: 12,
    fontWeight: "500",
  },
  value: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#88919e",
    marginVertical: 10,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  hideButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  hideText: {
    color: "yellow",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 5,
  },
});

export default ChartSwapPreview;
