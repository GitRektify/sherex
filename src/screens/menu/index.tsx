import React from "react";
import { View, StyleSheet } from "react-native";

import TopBar from "./components/TopBar";
import BottomMenu from "./components/BottomMenu";

const AppMenu = () => {

    return (
        <View style={styles.container}>
            <TopBar  />
            <BottomMenu />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default AppMenu;
