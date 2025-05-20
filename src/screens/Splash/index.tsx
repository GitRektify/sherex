import React, { useEffect } from "react";
import { Text, StyleSheet, ImageBackground } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { RootScreens } from "@/navigators/RootStackNavigator";
import { MainScreens } from "@/navigators/MainStackNavigator";

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          routes: [
            {
              name: RootScreens.main,
              params: { screen: MainScreens.mainPage },
            },
          ],
        })
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require("@/assets/image/splash.png")}
      style={styles.background}
      resizeMode="cover"
    >
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)", // Optional: soft overlay
  },
});

export default Splash;
