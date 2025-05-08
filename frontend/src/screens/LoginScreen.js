import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.134:3000'; 

const LoginScreen = ({ navigation, setLoggedIn }) => { // Receba a prop setLoggedIn
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        await AsyncStorage.setItem('jwt_token', data.token);
        setLoggedIn(true); // Atualize o estado de login no App.js
        // Não precisa de navigation.replace('Main') aqui
      } else {
        Alert.alert('Erro ao Logar', data.message || 'Credenciais inválidas.');
      }
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <View>
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Text>Senha:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Cadastrar" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LoginScreen;