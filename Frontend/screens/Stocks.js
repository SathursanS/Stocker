import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Stocks = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stocks</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9e9e9e",
  },
});

export default Stocks;
