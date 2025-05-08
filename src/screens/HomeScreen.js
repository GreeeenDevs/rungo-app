import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwt_token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
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
