import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navbar from "./components/navbar/navbar";
import Toast from "react-native-toast-message";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";

export default function App() {
  return (
    // <View style={styles.container}>
    //   {/* <Text>Stocker App for Eng Hack 2021!</Text>
    //   <StatusBar style="auto" /> */}

    // </View>

    <NavigationContainer>
      {/* <Navbar /> */}
      <Login />
      {/* <SignUp /> */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
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
