// src/navigation/HomeTabs.js (era src/navigation/AppNavigator.js)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import TransitionScreen from '../screens/TransitionScreen';
import LoadingScreen from '../screens/LoadingScreen';
import TabNavigator from './TabNavigator'; // Seu TabNavigator atual

const Stack = createStackNavigator();

// Esta função agora representa o fluxo APÓS o login (Splash -> Loading -> Tabs)
const HomeTabs = ({ setLoggedIn }) => { // Recebe setLoggedIn para poder fazer logout
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Transition" component={TransitionScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      {/* O nome da rota aqui é 'MainTabs' para o TabNavigator */}
      <Stack.Screen
        name="MainTabs"
        component={(props) => <TabNavigator {...props} setLoggedIn={setLoggedIn} />}
      />
    </Stack.Navigator>
  );
};

export default HomeTabs;