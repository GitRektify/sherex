import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { getTokenLogo } from "@/utils";
import { staticTokens, WETH_ADDRESS } from "@/utils/constants";
import ArrowDownIcon from "@/assets/svg/arrow-down.svg";

const ChartInforButtons = ({ info, setInfo, pairFor, tokens }) => {
  const [isArrowDown, setIsArrowDown] = useState(false);
  const [isActiveButtons, setIsActiveButtons] = useState(false);
  const [dispValue, setDispValue] = useState(pairFor === 0 ? info.token0 : info.token1);

  let data = staticTokens.map((token, index) => ({
    id: index,
    imgurl: token.logo || require("../../../assets/icon/ETH.png"),
    active: false,
    ...token,
  }));

  tokens?.forEach((token, index) => {
    data.push({
      id: staticTokens.length + index,
      imgurl: getTokenLogo(token.address),
      active: false,
      ...token,
    });
  });

  data = data.filter((d) => {
    if (pairFor === 0) return d.address !== info.token1.address;
    return d.address !== info.token0.address;
  });

  useEffect(() => {
    const selectedToken = data.find(
      (d) => d.address === (pairFor === 0 ? info.token0.address : info.token1.address) && d.isNative === (pairFor === 0 ? info.token0.isNative : info.token1.isNative)
    );
    if (selectedToken) setDispValue(selectedToken);
  }, [info]);

  const handleArrowDown = () => {
    setIsArrowDown(!isArrowDown);
    setIsActiveButtons(!isActiveButtons);
  };

  const handleItem = (idx) => {
    const selectedItem = data[idx];
    setDispValue(selectedItem);
    setInfo({ ...info, [pairFor === 0 ? "token0" : "token1"]: selectedItem });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleArrowDown} style={styles.buttonContainer}>
        <Image source={{ uri: dispValue.imgurl }} style={styles.image} />
        <Text style={styles.text}>{dispValue.symbol}</Text>
        <ArrowDownIcon style={[styles.arrow, isArrowDown && styles.arrowDown]} />
      </TouchableOpacity>
      {isActiveButtons && (
        <View style={styles.menu}>
          {data.map((item, index) => (
            <TouchableOpacity key={'char-info-button-'+index} style={styles.menuItem} onPress={() => handleItem(index)}>
              <Image source={{ uri: item.imgurl }} style={styles.menuImage} />
              <Text style={styles.menuText}>{item.symbol}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "column", alignItems: "center" },
  buttonContainer: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#142028", borderRadius: 10 },
  image: { width: 28, height: 28, marginRight: 10 },
  text: { fontSize: 16, color: "white" },
  arrow: { marginLeft: 10, transform: [{ rotate: "90deg" }] },
  arrowDown: { transform: [{ rotate: "-90deg" }] },
  menu: { position: "absolute", top: 50, left: 0, backgroundColor: "#142028", borderRadius: 10, padding: 5 },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 5 },
  menuImage: { width: 20, height: 20, marginRight: 10 },
  menuText: { fontSize: 14, color: "white" },
});

export default ChartInforButtons;
