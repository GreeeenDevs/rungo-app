// ./App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import isAuthenticated from "./src/auth/authGuard";
import HomeTabs from "./src/navigation/HomeTabs";

const Stack = createStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const tokenIsValid = await isAuthenticated();
      console.log("App.js: tokenIsValid =", tokenIsValid);
      setLoggedIn(tokenIsValid);
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  console.log("App.js: loggedIn =", loggedIn);

  if (checkingAuth) {
    return null; // Ou um indicador de carregamento
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!loggedIn ? (
          <>
            <Stack.Screen name="Login" component={(props) => <LoginScreen {...props} setLoggedIn={setLoggedIn} />} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={(props) => <HomeTabs {...props} setLoggedIn={setLoggedIn} />} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}