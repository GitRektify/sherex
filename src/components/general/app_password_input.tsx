import styled from "styled-components/native";
import { TouchableOpacity, View } from "react-native";
import AppTextInput from "./app_textinput";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  AppText,
  Container,
  FontSize,
  MainAxisAlignment,
  Row,
  SizedBox,
} from "./shared_styled";
import { ThemeColors } from "@/utils/colors";
import device from "@/utils/device";
interface IInput<T> {
  password: string;
  showPass: boolean;
  setPass: any;
  setShowPass: any;
  width?: number;
  paddingLeft: number;
  title: string;
  placeholder?: string;
  isShowRequired?: boolean;
  colorRequired?: string;
}

const AppPasswordInput = <T,>({
  password,
  showPass,
  setPass,
  setShowPass,
  width,
  paddingLeft,
  title,
  placeholder = "Password",
  isShowRequired = true,
  colorRequired,
}: IInput<T>) => {
  return (
    <SizedBox style={{ marginLeft: paddingLeft }} height={68}>
      <Row mainAxisAlignment={MainAxisAlignment.Start}>
        <AppText fontSize={FontSize.size16} color={ThemeColors.black}>
          {title}
        </AppText>
      </Row>

      <RowInput width={width ? width : device.width - 40}>
        <Input
          value={password}
          secureTextEntry={showPass}
          onChangeText={(newText) => setPass(newText)}
          keyboardType="default"
          placeholder={placeholder ? placeholder : "Input password"}
          width={width ? `${width}px` : `${device.width - 40}px`}
          paddingRight={40}
        />
        <ShowEyeButton onPress={() => setShowPass(!showPass)}>
          <Feather
            name={showPass ? "eye" : "eye-off"}
            size={20}
            color={ThemeColors.black}
          />
        </ShowEyeButton>
      </RowInput>
    </SizedBox>
  );
};

const Input = styled(AppTextInput)<{
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
  height: ${({ height }) => (height ? `${height}px` : "40px")};
  min-height: 40px;
  padding-top: ${({ pdTop }) => pdTop}px;
  margin-top: 0;
`;

const RowInput = styled(View)<{
  width?: number;
  height?: number;
  paddingLeft?: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  height: ${({ height }) => (height ? `${height}px` : "40px")};
  flex-direction: row;
  border-radius: 9px;
  align-items: center;
  margin-top: 28px;
  position: absolute;
`;

const ShowEyeButton = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  right: 15px;
  z-index: 1;
`;

export default AppPasswordInput;
