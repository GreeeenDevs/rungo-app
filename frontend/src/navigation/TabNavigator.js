// src/navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de ter @expo/vector-icons instalado

// Importe todas as telas que serão abas
import HomeScreen from '../screens/HomeScreen';
import BichinhoGameScreen from '../screens/BichinhoGameScreen';
import CollectionScreen from '../screens/CollectionScreen';
import ShopScreen from '../screens/ShopScreen';
import OptionsScreen from '../screens/OptionsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ setLoggedIn }) => { // Recebe setLoggedIn aqui
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FFCB05',
        tabBarInactiveTintColor: '#CCCCCC',
        tabBarStyle: {
          backgroundColor: '#1a202c',
          borderTopWidth: 0,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Início') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Meu Bichinho') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'Coleção') {
            iconName = focused ? 'layers' : 'layers-outline';
          } else if (route.name === 'Loja') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Opções') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Meu Bichinho" component={BichinhoGameScreen} />
      <Tab.Screen name="Coleção" component={CollectionScreen} />
      <Tab.Screen name="Loja" component={ShopScreen} />
      {/* Passa setLoggedIn para OptionsScreen para permitir logout */}
      <Tab.Screen
        name="Opções"
        component={(props) => <OptionsScreen {...props} setLoggedIn={setLoggedIn} />}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;