import { Dimensions, Platform, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");

const isIphoneX =
  Platform.OS === "ios" && !Platform.isPad && (height >= 812 || width >= 812);

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const widthPercent = width / BASE_WIDTH;
const heightPercent = height / BASE_HEIGHT;
const scale = Math.min(widthPercent, heightPercent);

function responsive(size: number) {
  const result = size * scale;
  return Number(result.toFixed(0));
}

const android = Platform.OS === "android";
const iOS = Platform.OS === "ios";

// android only
const statusBarHeight = android ? StatusBar.currentHeight : 0;

export default {
  isIphoneX,
  ToolbarHeight: isIphoneX ? 35 : 22,
  width,
  height,
  ThinMenuHeight: 50,
  ThickMenuHeight: 140,
  buttonHeight: 40,
  spacing: 10,
  responsive,
  android,
  statusBarHeight,
  iOS,
};
