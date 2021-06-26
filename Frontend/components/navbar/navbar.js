import React from "react";
// import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import News from "../../screens/News";
import Stocks from "../../screens/Stocks";
import Profile from "../../screens/Profile";
import CustomTabBar from "./customTabBar";

const Tab = createBottomTabNavigator();

const Navbar = () => {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="News"
        component={News}
        initialParams={{ icon: "earth" }}
      />
      <Tab.Screen
        name="Stocks"
        component={Stocks}
        initialParams={{ icon: "chart-line" }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{ icon: "account-outline" }}
      />
    </Tab.Navigator>
  );
};

export default Navbar;
