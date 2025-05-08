// ./src/navigation/HomeTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import StoreScreen from "../screens/StoreScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const HomeTabs = ({ setLoggedIn }) => {
  console.log("HomeTabs.js: setLoggedIn prop =", setLoggedIn);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={(props) => {
          console.log("HomeTabs.js: Props para HomeScreen =", props);
          return <HomeScreen {...props} setLoggedIn={setLoggedIn} />;
        }}
      />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;