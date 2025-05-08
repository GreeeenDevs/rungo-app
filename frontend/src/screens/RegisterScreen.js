import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

const API_URL = 'http://192.168.0.134:3000'; 

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCadastro = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, { // Endpoint de registro no backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message || 'Cadastro realizado! Faça o login.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro ao Cadastrar', data.message || 'Erro ao criar conta.');
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
      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
};

export default RegisterScreen;