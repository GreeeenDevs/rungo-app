// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import Button from '../components/Button'; // Importa o componente de botão
import BG from '../../assets/bgscream.gif'


const HomeScreen = ({ navigation }) => { // Navigation é crucial para navegar
  return (
    <ImageBackground source={BG} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>RunGO APP</Text>
        <Text style={styles.subtitle}>Sua jornada começa agora!</Text>

        <View style={styles.buttonContainer}>
          {/* Agora o botão LOJA navega para a ShopScreen */}
          <Button title="LOJA DE OVOS" onPress={() => navigation.navigate('Loja')} /> {/* 'Loja' é o nome da rota da aba */}
        </View>

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
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFCB05',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
});

export default HomeScreen;