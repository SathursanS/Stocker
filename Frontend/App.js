import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navbar from "./components/navbar/navbar";

export default function App() {
  return (
    // <View style={styles.container}>
    //   {/* <Text>Stocker App for Eng Hack 2021!</Text>
    //   <StatusBar style="auto" /> */}

    // </View>

    <NavigationContainer>
      <Navbar />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
