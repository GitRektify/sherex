import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import Splash from '@/screens/Splash';
import AuthStackNavigator, {AuthScreens} from './AuthStackNavigator';
import MainStackNavigator, { MainScreens } from "./MainStackNavigator";

const IOSRightTransition = {
  ...TransitionPresets.SlideFromRightIOS,
};

// export type RootStackParamList = {
//   Home: NavigatorScreenParams<HomeTabParamList>; // Nested Navigator
//   Logs: undefined;
// };

export type RootStackParamList = {
  [RootScreens.splash]: undefined;
  [RootScreens.auth]: {screen: AuthScreens; params?: undefined};
  [RootScreens.main]: {
    screen: MainScreens;
    params?: undefined;
  };
};

export enum RootScreens {
  splash = 'splash',
  auth = 'login',
  main = 'main',
}

export type RootNavigationProp<RouteName extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, RouteName>;

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName={RootScreens.splash}
      screenOptions={{headerShown: false}}>
      <RootStack.Screen name={RootScreens.splash} component={Splash} />
      <RootStack.Screen
        name={RootScreens.auth}
        component={AuthStackNavigator}
      />
      <RootStack.Screen
        name={RootScreens.main}
        component={MainStackNavigator}
        options={IOSRightTransition}
      />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
