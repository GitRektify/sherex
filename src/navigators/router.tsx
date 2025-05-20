import React from "react";
import { NavigationContainer, createNavigationContainerRef, } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {RootStackNavigator} from "./RootStackNavigator2";
import RootStackNavigator2 from "./RootStackNavigator";

export const navigationRef = createNavigationContainerRef();

const Root = () => (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    enabled={Platform.OS === "ios"}
    behavior="padding"
  >
      <StatusBar barStyle="dark-content" backgroundColor={"white"} />
      {/* <NavigationContainer ref={navigationRef}> */}
        <SafeAreaProvider>
          <RootStackNavigator2 />
        </SafeAreaProvider>
      {/* </NavigationContainer> */}
  </KeyboardAvoidingView>
);

export default Root;
