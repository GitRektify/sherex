import React from "react";
import { CommonActions, DrawerActions, RouteProp, useNavigation } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { SafeAreaContainer } from "@/components/general/shared_styled";
import AppMenu from "@/screens/menu";
import LiquidityView from "@/screens/liquidity/components/LiquidityTokenView";
import LiquidityChartView from "@/screens/liquidity/components/liquidity_chart_view";

// const IOSRightTransition = {
//   ...TransitionPresets.SlideFromRightIOS,
//   headerShown: false,
// };

export enum MainScreens {
  mainPage = "main_page",
  profile = "profile",
  //
  swap = "swap",
  liquidity = "liquidity",
  liquidityView = "liquidity_view",
  tokenView = "token_detail",
  liquidityChartView = "liquidity_chart_view",
  tokens = "tokens",
  staking = "staking"
}

export type MainStackParamList = {
  [MainScreens.mainPage]: undefined;
  [MainScreens.swap]: undefined;
  [MainScreens.liquidity]: undefined;
  [MainScreens.liquidityView]: { id: string };
  [MainScreens.liquidityChartView]: { id: string };
  [MainScreens.tokenView]:{id: string};
};

export type MainRouteProp<RouteName extends keyof MainStackParamList> =
  RouteProp<MainStackParamList, RouteName>;

export type MainNavigationProp<RouteName extends keyof MainStackParamList> =
            RouteProp<MainStackParamList, RouteName>;

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainStackNavigator = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaContainer edges={["top", "left", "right"]}>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        <MainStack.Screen name={MainScreens.mainPage} component={AppMenu} />
        {/* <MainStack.Screen
          name={MainScreens.liquidityView}
          component={LiquidityView}
          options={IOSRightTransition}
        />
        <MainStack.Screen
          name={MainScreens.liquidityChartView}
          component={LiquidityChartView}
          options={IOSRightTransition}
        /> */}
      </MainStack.Navigator>
    </SafeAreaContainer>
  );
};

export default MainStackNavigator;
