import React, { ReactNode, useState } from 'react';
import { LayoutAnimation, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { ThemeColors } from '@/utils/colors';


interface IProps {
    tabs: Array<string>;
    initial?: number;
    onChange?: (index: number) => void;
    type?: 'short' | 'long';
    value?: number;
}

interface ITabContent {
    current: number;
    contents: Array<ReactNode>;
    style?: any;
}

const TabBar = (props: IProps) => {

    const [current, setCurrent] = useState(props.initial || 0)

    const onChange = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setCurrent(index);
        props.onChange?.(index);
    }

    const value = props.value || current;

    return (
        <Container>
            {props.tabs.map((tab, index) => (
                <Tab key={'app-tab-bar-'+index} activeOpacity={0.9} onPress={() => onChange(index)}>
                    <Title selected={value === index}>{tab}</Title>
                </Tab>
            ))}
            {props.type == 'long' ?
                <Indicator2 position={value} size={props.tabs.length} />
                : <Indicator position={value} size={props.tabs.length} />}
        </Container>
    )
}

export const TabContent = (props: ITabContent) => {
    return (
        <Content style={props.style}>
            {props.contents.map((content, idx) => (
                idx == props.current && <Item key={'app-tab-bar-content-'+idx}>
                    {content}
                </Item>
            ))}
        </Content>
    )
}

export default TabBar;

const Container = styled(View)`
    flex-direction: row;
    width: 100%;
    height: 50px;

`

const Tab = styled(TouchableOpacity)<{ selected?: boolean }>`
    flex: 1;
    align-items: center;
    justify-content: center;
    border-bottom-width: 1px;
    border-bottom-color: ${({ selected }) => selected ? ThemeColors.white : ThemeColors.transparent};
`

const Title = styled(Text) <{ selected?: boolean }>`
    color: ${({ selected }) => selected ? ThemeColors.white : ThemeColors.colorFFFFFF61};
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
`

const Indicator = styled(View) <{ position: number; size: number }>`
    position: absolute;
    bottom: 12px;
    left: ${({ position, size }) => (position + 0.5) * 100 / size - 3}%;
    width: 6%
    background-color: ${ThemeColors.white};
    height: 4px;
    border-radius: 2px;
`

const Indicator2 = styled(View) <{ position: number; size: number }>`
    position: absolute;
    bottom: 0;
    left: ${({ position, size }) => 100 / size * position}%;
    width: ${({ size }) => 100 / size}%;
    background-color: ${ThemeColors.white};
    height: 2px;
    border-radius: 2px;
`

const Content = styled(View)`
    flex: 1;
`

const Item = styled(View)`
    flex: 1;
`