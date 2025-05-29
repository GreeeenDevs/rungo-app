import React, { useState } from 'react';
import { TouchableOpacity, View, Text, TextInput, Alert, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BG from '../../assets/bgscream.gif';
import { loginUser } from '../services/apiService'; // Importa a função de login

const LoginScreen = ({ navigation, setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password); // Chama a função do apiService

      if (data && data.token) {
        await AsyncStorage.setItem('jwt_token', data.token);
        setLoggedIn(true);
        Alert.alert('Sucesso', data.message || 'Login bem-sucedido!');
      } else {
        // A apiService já trata o erro e mostra um Alert se !response.ok
        Alert.alert('Erro ao Logar', data.message || 'Credenciais inválidas.');
      }
    } catch (error) {
      // Erro já tratado pelo apiService, mas você pode adicionar logs aqui se precisar
      console.error('Erro no componente LoginScreen:', error);
    }
  };

  return (
    <ImageBackground source={BG} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Bem-vindo de volta!</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Não tem uma conta? Cadastre-se</Text>
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
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#FFCB05',
    marginTop: 20,
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default LoginScreen;