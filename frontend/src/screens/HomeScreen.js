import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import Button from '../components/Button'; // Importa o componente de botão
import BG from '../../assets/bgscream.gif'


const HomeScreen = ({ navigation }) => { // Navigation ainda é útil se você tiver fluxos internos da Home para Stack Navigator
  return (
    <ImageBackground source={BG} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>RunGO APP</Text>
        <Text style={styles.subtitle}>Sua jornada começa agora!</Text>

        <View style={styles.buttonContainer}>
          {/* Este botão pode ser para iniciar uma partida TCG real ou outra funcionalidade */}
          <Button title="LOJA" onPress={() => alert('escolha seu primeiro ovo')} />
          {/* Os botões de Coleção, Loja, Opções foram removidos, pois agora são abas */}
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