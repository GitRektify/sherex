import React from "react";
import { Pressable, Text, View, StyleSheet, Image } from "react-native";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import Swap from "@/screens/swap";
import Liquidity from "@/screens/liquidity";
import Tokens from "@/screens/tokens";
import Portfolio from "@/screens/portfolio";
import Staking from "@/screens/staking/components/StakingPage";

import SwapIcon from '@/assets/svg/swap.svg';
import LiquidityIcon from '@/assets/svg/liquidity.svg';
import TokenIcon from '@/assets/svg/token.svg';
import PortfolioIcon from '@/assets/svg/portfolio.svg';
import StackingIcon from '@/assets/svg/staking.svg';

const TabIcons = [<SwapIcon />, <LiquidityIcon />, <TokenIcon />, <PortfolioIcon />, <StackingIcon />];
const Tab = createBottomTabNavigator();

const MenuTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={'bottom-menu-' + label.toString()}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            {isFocused ? (
              <View style={styles.tabContainer}>
                <Text style={styles.tabTextAction}>{label.toString()}</Text>
                {TabIcons[index]}
                <Image
                  source={require('@/assets/image/menu-lamp.png')}
                  alt="alt"
                  style={styles.lamp}
                />
              </View>
            ) : (
              <Text style={styles.tabText}>{label.toString()}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const BottomMenu = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName={t("nav.swap")}
      tabBar={(props) => <MenuTab {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen name={t("nav.swap")} component={Swap} />
      <Tab.Screen name={t("nav.liquidity")} component={Liquidity} />
      <Tab.Screen name={t("nav.tokens")} component={Tokens} />
      <Tab.Screen name={t("nav.portfolio")} component={Portfolio} />
      <Tab.Screen name={t("nav.staking")} component={Staking} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: 'rgba(15, 15, 15, 0.9)', // use opacity for see-through effect
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#7B7B7B',
  },
  tabTextAction: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#FFFFFF',
  },
  lamp: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
    resizeMode: 'stretch',
  },
});

export default BottomMenu;
