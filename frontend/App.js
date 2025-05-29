// PetHappinessApp/App.js
import React, { useState, useEffect } from 'react';
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

const Stack = createStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(null); // null = verificando, true = logado, false = não logado

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isAuth = await isAuthenticated();
      setLoggedIn(isAuth);
    };
    checkLoginStatus();
  }, []);

  // Use um useEffect para reagir às mudanças em `loggedIn` e (re)verificar o status de autenticação.
  // Isso é importante para o cenário de logout ou quando o token expira.
  useEffect(() => {
    const verifyAuthOnStateChange = async () => {
      if (loggedIn === false) { // Se o estado mudar para false, significa que foi deslogado (pelo OptionsScreen ou apiService)
        console.log("App.js: Estado de login mudou para false. Resetando token se existir.");
        await AsyncStorage.removeItem('jwt_token'); // Garante que o token seja removido
        // Não é necessário navegar explicitamente aqui, pois o render condicional já fará isso.
      } else if (loggedIn === true) {
        console.log("App.js: Estado de login mudou para true.");
      }
    };
    verifyAuthOnStateChange();
  }, [loggedIn]);


  if (loggedIn === null) {
    // Ainda verificando o status de login
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
        // Se estiver logado, exibe o fluxo principal (Splash -> Loading -> Tabs)
        <HomeTabs setLoggedIn={setLoggedIn} />
      ) : (
        // Se não estiver logado, exibe as telas de autenticação
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={(props) => <LoginScreen {...props} setLoggedIn={setLoggedIn} />} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}