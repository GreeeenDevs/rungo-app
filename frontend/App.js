import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Platform, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importe suas telas de autenticação
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// Importe o HomeTabs (que agora inclui Splash, Loading e TabNavigator)
import HomeTabs from './src/navigation/HomeTabs';

// Importe o authGuard
import isAuthenticated from './src/auth/authGuard';

import { StatusBar } from 'react-native';

// Importação segura do ImmersiveMode (evita erro de importação/expo)
let ImmersiveMode = undefined;
try {
  ImmersiveMode = require('react-native-immersive-bars');
} catch (e) {
  ImmersiveMode = undefined;
}

const Stack = createStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(null);

  // Máximo de imersão: StatusBar oculta em ambas plataformas, ImmersiveMode (se disponível) para Android
  useEffect(() => {
    // Esconde StatusBar (iOS e Android)
    StatusBar.setHidden(true, 'fade');

    // Modo imersivo só em Android, se ImmersiveMode disponível
    if (Platform.OS === 'android' && ImmersiveMode && ImmersiveMode.setBarMode) {
      ImmersiveMode.setBarMode('FullSticky');
    }

    // Atualiza modo imersivo ao retornar do background
    const handleAppStateChange = (state) => {
      if (state === 'active') {
        StatusBar.setHidden(true, 'fade');
        if (Platform.OS === 'android' && ImmersiveMode && ImmersiveMode.setBarMode) {
          ImmersiveMode.setBarMode('FullSticky');
        }
      }
    };
    const sub = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Restaura StatusBar e barra do sistema ao sair do app/tela
      StatusBar.setHidden(false, 'fade');
      if (Platform.OS === 'android' && ImmersiveMode && ImmersiveMode.setBarMode) {
        ImmersiveMode.setBarMode('Normal');
      }
      sub.remove && sub.remove(); // RN >= 0.65
    };
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isAuth = await isAuthenticated();
      setLoggedIn(isAuth);
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const verifyAuthOnStateChange = async () => {
      if (loggedIn === false) {
        await AsyncStorage.removeItem('jwt_token');
      }
    };
    verifyAuthOnStateChange();
  }, [loggedIn]);

  if (loggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a202c' }}>
        <ActivityIndicator size="large" color="#FFCB05" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Verificando login...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {loggedIn ? (
        <HomeTabs setLoggedIn={setLoggedIn} />
      ) : (
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} setLoggedIn={setLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}