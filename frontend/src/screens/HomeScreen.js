// ./src/screens/HomeScreen.js
import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation, setLoggedIn }) => {
  console.log("HomeScreen.js: setLoggedIn prop =", setLoggedIn);

  const handleLogout = async () => {
    try {
      console.log("HomeScreen.js: Tentando logout...");
      await AsyncStorage.removeItem('jwt_token');
      console.log("HomeScreen.js: Token removido.");
      console.log("HomeScreen.js: Chamando setLoggedIn(false)...");
      setLoggedIn(false); // Atualize o estado de login no App.js
      console.log("HomeScreen.js: setLoggedIn chamado.");
    } catch (error) {
      console.error("HomeScreen.js: Erro ao sair:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao sair.');
    }
  };

  return (
    <View>
      <Text>Bem-vindo à Home!</Text>
      <Button title="Ir para Loja" onPress={() => navigation.navigate('Store')} />
      <Button title="Configurações" onPress={() => navigation.navigate('Settings')} />
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;