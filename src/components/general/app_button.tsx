import React from "react";
import { Platform, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import {StyleProp} from "react-native/Libraries/StyleSheet/StyleSheet";
import {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { ThemeColors } from "@/utils/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface AppButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  iconName?: IconProp;
  size?: number;
  title: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  iconColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  widgetIcon?: React.ReactNode;
  widgetTitle?: React.ReactNode;
  paddingHorizontal?: number;
  paddingVertical?: number;
  fontWeight?: number;
  minWidth?: number;
  fontSize?: number;
  marginRight?: number;
  marginBottom?: number;
  marginHorizontal?: number;
  style?: ViewStyle;
}

const ButtonContainer = styled(TouchableOpacity)<{
  disabled?: boolean;
  backgroundColor?: string;
  width?: number;
  height?: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  minWidth?: number;
  marginRight?: number;
  marginBottom?: number;
  marginHorizontal?: number;
  opacity?: number;
}>`
  height: ${({ height }) => (height ? `${height}px` : "44px")};
  width: ${({ width }) => (width ? `${width}px` : undefined)};
  border-radius: ${({ borderRadius }) =>
    borderRadius ? `${borderRadius}px` : "4px"};
  background-color: ${({ disabled, backgroundColor }) =>
    backgroundColor || "#000000"};
  border-color: ${({ disabled, borderColor }) => borderColor || "transparent"};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-width: ${({ borderWidth }) =>
    borderWidth ? `${borderWidth}px` : "1px"};
  padding-horizontal: ${({ paddingHorizontal }) =>
    paddingHorizontal ? `${paddingHorizontal}px` : "0px"};
  padding-vertical: ${({ paddingVertical }) =>
    paddingVertical ? `${paddingVertical}px` : "0px"};
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}px` : "0px")};
  margin-right: ${({ marginRight }) =>
    marginRight ? `${marginRight}px` : "0px"};
  margin-bottom: ${({ marginBottom }) =>
    marginBottom ? `${marginBottom}px` : "0px"};
  margin-horizontal: ${({ marginHorizontal }) => marginHorizontal || 0}px;
  opacity: ${({ disabled }) => (disabled ? Platform.OS == "ios" ? 0.2 : 0.6 : 1)};

`;

const ButtonText = styled(Text)<{
  textColor?: string;
  marginLeft?: string;
  fontWeight?: number;
  fontSize?: number;
}>`
  color: ${({ textColor }) => (textColor ? textColor : ThemeColors.white)};
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : "600")};
  text-align: center;
  margin-left: ${({ marginLeft }) => (marginLeft ? marginLeft : "8px")};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : "14px")};
  line-height: ${({ fontSize }) => (fontSize ? `${fontSize * 1.5}px` : "21px")};
  padding-bottom: ${Platform.OS === "android" ? "2px" : "0px"};
`;

const AppButton: React.FC<AppButtonProps> = ({
  onPress,
  disabled,
  iconName,
  size = 24,
  title,
  width,
  height,
  backgroundColor,
  borderColor,
  textColor,
  iconColor,
  borderWidth,
  borderRadius,
  widgetIcon,
  widgetTitle,
  paddingHorizontal,
  paddingVertical,
  fontWeight,
  minWidth,
  fontSize,
  marginRight,
  marginBottom,
  marginHorizontal,
  style
}) => {
  return (
    <ButtonContainer
     style={style}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      minWidth={minWidth}
      marginRight={marginRight}
      marginBottom={marginBottom}
      marginHorizontal={marginHorizontal}
    >
      {widgetIcon ? (
        widgetIcon
      ) : iconName != undefined ? (
        <FontAwesomeIcon
        icon={iconName}
          size={size}
          color={iconColor || ThemeColors.white}
        />
      ) : null}
      {widgetTitle ? (
        widgetTitle
      ) : (
        <ButtonText
          fontSize={fontSize}
          fontWeight={fontWeight}
          textColor={textColor}
        >
          {title}
        </ButtonText>
      )}
    </ButtonContainer>
  );
};

export default AppButton;
