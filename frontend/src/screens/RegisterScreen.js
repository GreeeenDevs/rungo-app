import React, { useState } from 'react';
import { TouchableOpacity , ImageBackground, StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import BG from '../../assets/bgscream.gif'


const API_URL = 'http://10.68.76.230:3000'; 

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, { // Endpoint de registro no backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
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
    <ImageBackground source={BG} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Cadastro</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />        
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.loginText}>Já tem conta? Faça Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFCB05',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3D7DCA',
  },
  button: {
    backgroundColor: '#3D7DCA',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFDE00',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loginText: {
    color: '#ADD8E6',
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;