import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TextInput, TextInputProps } from 'react-native';
import device from '@/utils/device';

interface AppTextInputProps extends TextInputProps {
  placeholder?: string;
  width?: string;
  height?: number;
  paddingLeft?: string;
  paddingRight?: number;
  backgroundColor?: string;
  borderRadius?: number;
  marginTop?: string;
  borderBottomWidth?: string;
  borderWidth?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const StyledTextInput = styled(TextInput) <{
  isFocused: boolean;
  width?: string;
  height?: number;
  paddingLeft?: string;
  paddingRight?: number;
  backgroundColor?: string;
  borderRadius?: number;
  marginTop?: string;
  borderBottomWidth?: string;
  borderWidth?: string;
}>`
  width: ${({ width }) => width || `${device.width - 20}px`};
  height: ${({ height }) => `${height || 44}px`};
  padding-left: ${({ paddingLeft }) => paddingLeft || '10px'};
  padding-right: ${({ paddingRight }) => paddingRight || 0}px;
  padding-vertical: 0;
  background-color: ${({ backgroundColor }) => backgroundColor || '#f8f8f8'};
  border-radius: ${({ borderRadius }) => `${borderRadius || 10}px`};
  margin-top: ${({ marginTop }) => marginTop || '5px'};
  color: #676e74;
  border-bottom-width: ${({ borderBottomWidth }) => borderBottomWidth || '1px'};
  border-width: ${({ borderWidth }) => borderWidth || '0px'};
  border-color: ${({ isFocused }) => (isFocused ? '#007aff' : "#D2D7D9BF")};
`;

const AppTextInput: React.FC<AppTextInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <StyledTextInput
      {...props}
      isFocused={isFocused}
      placeholderTextColor="#676e7480"
      onBlur={() => {
        setIsFocused(false);
        props.onBlur && props.onBlur();
      }}
      onFocus={() => {
        setIsFocused(true);
        props.onFocus && props.onFocus();
      }}
    />
  );
};

export default AppTextInput;
