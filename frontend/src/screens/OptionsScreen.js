import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe para logout
import BG from '../../assets/bgscream.gif'


const OptionsScreen = ({ navigation, setLoggedIn }) => { // Recebe setLoggedIn
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Remove o token
      setLoggedIn(false); // Define o estado para deslogado
      Alert.alert('Sucesso', 'Você foi desconectado!');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert('Erro', 'Não foi possível fazer logout.');
    }
  };

  return (
    <ImageBackground source={BG} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Opções</Text>
        <Text style={styles.subtitle}>Ajuste suas configurações!</Text>

        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* Outras opções aqui */}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFCB05',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 40,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#c0392b', // Vermelho para Logout
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OptionsScreen;