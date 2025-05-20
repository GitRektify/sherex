import { View, Text, Animated, ScrollView, Platform, GestureResponderEvent } from "react-native";
import styled from "styled-components";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTextInput from "./app_textinput";
import { ThemeColors } from "@/utils/colors";
import {Image} from "react-native";
import device from "@/utils/device";

export enum CrossAxisAlignment {
  Start = "flex-start",
  Center = "center",
  End = "flex-end",
  Stretch = "stretch",
}

export enum MainAxisAlignment {
  Start = "flex-start",
  Center = "center",
  End = "flex-end",
  SpaceBetween = "space-between",
  SpaceAround = "space-around",
  SpaceEvenly = "space-evenly",
}

export enum FontSize {
  size50 = "50px",
  size40 = "40px",
  size38 = "38px",
  size28 = "28px",
  size26 = "26px",
  size24 = "24px",
  size22 = "22px",
  size20 = "20px",
  size18 = "18px",
  size16 = "16px",
  size15 = "15px",
  size14 = "14px",
  size13 = "13px",
  size12 = "12px",
  size11 = "11px",
  size10 = "10px",
}

export enum FontWeight {
  W800 = "800",
  W700 = "700",
  W600 = "600",
  W500 = "500",
  W400 = "400",
  W300 = "300",
}

interface AlignmentProps {
  crossAxisAlignment?: CrossAxisAlignment;
  mainAxisAlignment?: MainAxisAlignment;
}

interface TextStyleProps {
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  textAlign?: "center" | "left" | "right" | "justify";
}

interface StackProps {
  backgroundColor?: string;
  width?: string;
  maxHeight?: number;
  position?: string;
  borderRadius?: string;
}

interface CustomImageProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  marginRight?: number;
  marginBottom?: number;
  resizeMode?: "cover" | "contain" | "stretch" | "center" | "repeat";
}

interface ContainerProps {
  bgColor?: string;
  paddingLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  flex?: number;
  justifyContent?: MainAxisAlignment;
  onTap?: (event: GestureResponderEvent) => void; 
}

/**
 * Use for all screens in MainStack
 */
export const Container = styled(View)<ContainerProps>`
  flex: ${({ flex }) => flex || 1};
  background-color: ${({ bgColor }) => bgColor || ThemeColors.white};
  padding-left: ${({ paddingLeft }) => `${paddingLeft}px` || "0px"};
  padding-right: ${({ paddingRight }) => `${paddingRight}px` || "0px"};
  padding-top: ${({ paddingTop }) => `${paddingTop}px` || "0px"};
  padding-bottom: ${({ paddingBottom }) => `${paddingBottom}px` || "0px"};
  justify-content: ${({ justifyContent }) =>
    justifyContent || MainAxisAlignment.Start};
`;

export const SizedBox = styled(View)<{
  bgColor?: string;
  width?: number;
  height?: number;
  paddingLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
}>`
  background-color: ${({ bgColor }) => bgColor || ThemeColors.transparent};
  width: ${({ width }) => `${width}px` || "0px"};
  height: ${({ height }) => `${height}px` || "0px"};
  padding-left: ${({ paddingLeft }) => `${paddingLeft}px` || "0px"};
  padding-right: ${({ paddingRight }) => `${paddingRight}px` || "0px"};
  padding-top: ${({ paddingTop }) => `${paddingTop}px` || "0px"};
  padding-bottom: ${({ paddingBottom }) => `${paddingBottom}px` || "0px"};
`;

export const Spacing = styled(View)<{ width?: number; height?: number }>`
  padding-right: ${(props) => `${props?.width ? props.width : 0}px`};
  padding-top: ${(props) => `${props?.height ? props.height : 0}px`};
`;

export const Row = styled(View)<AlignmentProps>`
  flex-direction: row;
  align-items: ${(props) => props.crossAxisAlignment || "center"};
  justify-content: ${(props) => props.mainAxisAlignment || "center"};
  width: 100%;
  background-color: transparent;
`;

export const Column = styled(View)<AlignmentProps>`
  flex-direction: column;
  align-items: ${(props) => props.crossAxisAlignment || "center"};
  justify-content: ${(props) => props.mainAxisAlignment || "center"};
`;

export const AppText = styled(Text).attrs<TextStyleProps>((props) => ({
  numberOfLines: props.numberOfLines || 100,
}))<TextStyleProps>`
  font-size: ${(props) => props.fontSize || "12px"};
  color: ${(props) => props.color || ThemeColors.black};
  font-weight: ${(props) => props.fontWeight || "normal"};
  text-align: ${(props) => props.textAlign || "left"};
`;

export const LinkText = styled(Text)<TextStyleProps>`
  font-size: ${(props) => props.fontSize || "12px"};
  color: ${(props) => props.color || ThemeColors.main};
  text-decoration-line: underline;
  text-decoration-color: ${(props) => props.color || ThemeColors.main};
`;

export const Divider = styled(View)<{
  height?: number;
  backgroundColor?: string;
  width?: number;
}>`
  height: ${({ height }) => height || 0.5}px;
  background-color: ${({ backgroundColor }) => backgroundColor || "#666666"};
  width: ${({ width }) => width || 90}%;
  align-self: center;
`;

export const Stack = styled(Animated.View)<StackProps>`
  background-color: ${({ backgroundColor }) => backgroundColor || "#E7E2D370"};
  width: ${({ width }) => width || "100%"};
  max-height: ${({ maxHeight }) => maxHeight || 80}%;
  position: ${({ position }) => position || "relative"};
  border-radius: ${({ borderRadius }) => borderRadius || "6px"};
`;

export const Center = styled(View)`
  justify-content: center;
  align-items: center;
`;

export const CustomImage = styled(Image)<CustomImageProps>`
  width: ${({ width }) => width || 20}px;
  height: ${({ height }) => height || 20}px;
  border-radius: ${({ borderRadius }) => borderRadius || 0}px;
  border-width: ${({ borderWidth }) => borderWidth || 0}px;
  border-color: ${({ borderColor }) => borderColor || "#000000"};
  resize-mode: ${({ resizeMode }) => resizeMode || "cover"};
  margin-right: ${({ marginRight }) => marginRight || 0}px;
  margin-bottom: ${({ marginBottom }) => marginBottom || 0}px;
`;

export const FullScreenImage = styled(Image)`
  position: absolute;
  width: ${device.width}px;
  height: ${device.height}px;
  top: 0;
  left: 0;
`;

export const ScrollViewContainer = styled(ScrollView)`
  flex: 1;
  background-color: ${ThemeColors.white};
`;


/**
 * Only used for screens in AuthStack
 *
 * Screens in MainStack will use Container
 * @see {@link Container}
 */
export const SafeAreaContainer = styled(SafeAreaView)`
  background-color: ${ThemeColors.white};
  flex: 1;
`;

export const RowStart = styled(View)<{ mrTop?: number; mrBottom?: number }>`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: ${({ mrTop }) => mrTop || 0}px;
  margin-bottom: ${({ mrBottom }) => mrBottom || 0}px;
`;

export const RowEnd = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const AbsoluteView = styled(View)<{
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}>`
  position: absolute;
  top: ${({ top }) => top}px;
  right: ${({ right }) => right}px;
  bottom: ${({ bottom }) => bottom}px;
  left: ${({ left }) => left}px;
`;

export const Input = styled(AppTextInput)<{
  width?: string;
  height?: number;
  pdTop?: number;
}>`
  width: ${({ width }) => width};
  border-radius: 6px;
  border-width: 1px;
  background-color: white;
  max-width: 100%;
  padding-left: 5px;
  height: ${({ height }) => height}px;
  min-height: 40px;
  padding-top: ${({ pdTop }) => pdTop}px;
  margin-top: 0;
`;
