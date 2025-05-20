import { RouteProp } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from "@react-navigation/stack";
import React from "react";
import Splash from "@/screens/Splash";

const IOSRightTransition = {
  ...TransitionPresets.SlideFromRightIOS,
  headerShown: false,
};

type AuthStackParamList = {
  [AuthScreens.signIn]: undefined;
};

export enum AuthScreens {
  signIn = "signIn",
}

export type AuthRouteProp<RouteName extends keyof AuthStackParamList> =
  RouteProp<AuthStackParamList, RouteName>;

export type AuthNavigationProp<RouteName extends keyof AuthStackParamList> =
  StackNavigationProp<AuthStackParamList, RouteName>;

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={IOSRightTransition}>
      <AuthStack.Screen name={AuthScreens.signIn} component={Splash} />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
