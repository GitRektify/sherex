import React, { ReactElement, ReactNode, useState } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Spacing } from "./shared_styled";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import device from "@/utils/device";
import { ThemeColors } from "@/utils/colors";

interface AppScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const AppScrollView = React.forwardRef<ScrollView, AppScrollViewProps>(
  ({ children, contentContainerStyle, ...props }, ref) => {
    const { top, bottom } = useSafeAreaInsets();

    const [footerHeight, setFooterHeight] = useState<number>(0);

    const onLayout = (e: LayoutChangeEvent) => {
      setFooterHeight(e.nativeEvent.layout.height);
    };

    return (
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            minHeight:
              device.height -
              55 -
              (!device.android ? top + bottom : 0),
          },
          contentContainerStyle,
        ]}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    backgroundColor: ThemeColors.white,
  },
  footerView: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default AppScrollView;
