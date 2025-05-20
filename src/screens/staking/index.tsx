import React from "react";
import { View, StyleSheet } from "react-native";
import Staking from "./components/StakingPage";

const App = () => {
  return (
    <View style={styles.Container}>
      <Staking />
    </View>
  )
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
})

export default App;