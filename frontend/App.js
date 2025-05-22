// ./App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar, ActivityIndicator, View, StyleSheet } from 'react-native'; // Importe para um indicador de carregamento

// Importe as telas de autenticação
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

// Importe a lógica de autenticação (vamos criar este arquivo)
import isAuthenticated from "./src/auth/authGuard";

// O TabNavigator agora se chamará HomeTabs para seguir seu código
import HomeTabs from "./src/navigation/HomeTabs"; // Este será o seu TabNavigator atual

const Stack = createStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const tokenIsValid = await isAuthenticated();
        console.log("App.js: tokenIsValid =", tokenIsValid);
        setLoggedIn(tokenIsValid);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setLoggedIn(false); // Garante que não loga se houver erro
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  console.log("App.js: loggedIn =", loggedIn);

  if (checkingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFCB05" />
      </View>
    ); // Exibe um indicador de carregamento enquanto verifica a autenticação
  }

  return (
    <NavigationContainer>
      <StatusBar hidden={true} /> {/* Mantém a barra de status oculta */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!loggedIn ? (
          // Telas de Autenticação
          // Use Group para agrupar condicionalmente, conforme a sintaxe do React Navigation
          <Stack.Group>
            <Stack.Screen
              name="Login"
              component={(props) => <LoginScreen {...props} setLoggedIn={setLoggedIn} />}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        ) : (
          // Conteúdo Principal do App (que inclui as telas de splash/loading e depois as abas)
          // O AppNavigator existente será 'HomeTabs' agora
          <Stack.Screen
            name="MainAppFlow" // Nome da rota para o fluxo principal após login
            component={(props) => <HomeTabs {...props} setLoggedIn={setLoggedIn} />}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a202c', // Cor de fundo consistente
  },
});