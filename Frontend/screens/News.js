import React from "react";
import { StyleSheet, Text, View } from "react-native";

const News = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>News</Text>
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

export default News;
