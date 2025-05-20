import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, TouchableWithoutFeedback, Keyboard, Pressable } from "react-native";
import { staticTokens, WETH_ADDRESS } from "@/utils/constants";
import { getTokenLogo } from "@/utils/index";
import ArrowDown from "@/assets/svg/arrow-down.svg"; // Assuming you have an ArrowDown component using react-native-svg
import TokenSelectButton from "./TokenSelectButton";

const TokenSelectButtonGroup = ({ info, setInfo, pairFor, tokens }) => {
  const [rotate, setRotate] = useState(false);
  const [isArrowDown, setIsArrowDown] = useState(false);
  const [isActiveButtons, setIsActiveButtons] = useState(false);
  const [dispValue, setDispValue] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    let data = staticTokens.map((token, index) => {
      return {
        id: index,
        imgurl: token.logo ? token.logo : require('@/assets/svg/token/BNB.svg'),
        active: false,
        ...token,
      };
    });

    // Add user tokens if provided
    // tokens && tokens.forEach((token, index) => {
    //   data.push({
    //     id: staticTokens.length + index,
    //     imgurl: getTokenLogo(token.address),
    //     active: false,
    //     ...token,
    //   });
    // });

    data = data.filter((d) => {
      if (pairFor === 0) return d.address !== info.token1.address;
      else if (pairFor === 1) return d.address !== info.token0.address;
    });

    setMenuItems(data);

    // Set the selected token based on pairFor
    if (pairFor === 0) {
      const selectedToken0 = data.find(d => d.address === info.token0.address && d.isNative === info.token0.isNative);
      setDispValue(selectedToken0 || data[0]);
    } else {
      const selectedToken1 = data.find(d => d.address === info.token1.address && d.isNative === info.token1.isNative);
      setDispValue(selectedToken1 || data[0]);
    }
  }, [info, pairFor, tokens]);

  const handleArrowDown = () => {
    setIsArrowDown(!isArrowDown);
    setIsActiveButtons(!isActiveButtons);
  };

  const handleItem = (_idx) => {
    const newMenuItems = menuItems.map((item, idx) => {
      if (_idx === idx) {
        item.active = true;
        setDispValue(item);
        if (pairFor === 0) {
          setInfo({ ...info, token0: item });
        } else {
          setInfo({ ...info, token1: item });
        }
      } else {
        item.active = false;
      }
      return item;
    });

    setMenuItems(newMenuItems);
    setIsActiveButtons(false); // <-- Close dropdown after selection
    setIsArrowDown(!isArrowDown);
  };

  // Dismiss the dropdown menu when clicking outside
  const handlePressOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsActiveButtons(false);
      setIsArrowDown(!isArrowDown);
    }
  };

  const onDismiss = () => {
    setIsActiveButtons(false);
    setIsArrowDown(!isArrowDown);
  };

  return (
    <TouchableWithoutFeedback onPress={onDismiss}>
      <View style={styles.container} onStartShouldSetResponder={handlePressOutside}>
        <TouchableOpacity onPress={handleArrowDown} style={s.token}>
          <View style={styles.innerContainer}>
            {/* Show specific token icon or default image */}
            {dispValue?.symbol === 'SHRX' ? (
              <Image source={require('@/assets/image/sherex.png')} style={s.icon} />
            ) : (
              <Image source={{ uri: dispValue?.imgurl }} style={s.icon} />
            )}
            <Text style={s.symbol}>{dispValue?.symbol}</Text>
            <ArrowDown style={[styles.arrow, isArrowDown ? styles.arrowDown : null]} />
          </View>
        </TouchableOpacity>

        {/* Dropdown menu */}
        {isActiveButtons && (
          <View ref={dropdownRef} style={styles.dropdownMenu}>
            {menuItems.map((item, index) => (
              <TokenSelectButton key={index} item={item} index={index} handleItem={handleItem} />
            ))}
          </View>
        )}
        {isActiveButtons && (
          <Pressable style={styles.dropdownMenuClose} onPress={() => [setIsActiveButtons(false),setIsArrowDown(!isArrowDown)]} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 10000,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tokenImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  tokenText: {
    fontSize: 16,
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrow: {
    marginRight: 8,
    transform: [{ rotate: "0deg" }],
    transition: "transform 0.3s ease-in-out",
  },
  arrowDown: {
    transform: [{ rotate: "180deg" }],
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    width: "100%",
    backgroundColor: "#142028",
    borderRadius: 10,
    zIndex: 100000,
    opacity: 1,
    // left: 10,
  },
  dropdownMenuClose: {
    position: "absolute",
    flex: 1,
    top: "-5000%",
    left: "-5000%",
    width: "100000%",
    height: '100000%',
    // backgroundColor: "#5e5f5f",
    zIndex: 10,
  },
});

const s = StyleSheet.create({
  token: {
    // bottom: -16,
    // right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    borderTopLeftRadius: 27,
    borderTopRightRadius: 42,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 27,
    paddingLeft: 6,
    paddingRight: 6,
    paddingVertical: 6,
  },
  pressed: {
    backgroundColor: '#333333'
  },
  icon: { width: 24, height: 24 },
  symbol: { color: '#ffffff', fontSize: 10, marginLeft: 4, marginRight: 15 },
  chevron: { width: 11, height: 11 },
});

export default TokenSelectButtonGroup;
