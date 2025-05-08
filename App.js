import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./src/screens/LoginScreen";
import CadastroScreen from "./src/screens/CadastroScreen";
import HomeScreen from "./src/screens/HomeScreen";
import StoreScreen from "./src/screens/StoreScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import isAuthenticated from "./src/auth/authGuard";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Store" component={StoreScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoggedIn(await isAuthenticated());
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!loggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={HomeTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
