import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import TabButton from "./tabIcon";

const { width } = Dimensions.get("screen");

const CustomTabBar = ({ state, navigation }) => {
  const [selected, setSelected] = useState("News");

  const handleSelectedTab = (currentTab) =>
    currentTab === selected ? "#1e88e5" : "#9e9e9e";

  const handlePress = (currentTab, index) => {
    if (state.index !== index) {
      setSelected(currentTab);
      navigation.navigate(currentTab);
    }
  };

  const { routes } = state;

  return (
    <View style={styles.container}>
      {routes.map((route, index) => (
        <TabButton
          tab={route}
          icon={route.params.icon}
          onPress={() => handlePress(route.name, index)}
          color={handleSelectedTab(route.name)}
          key={route.key}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
});

export default CustomTabBar;
