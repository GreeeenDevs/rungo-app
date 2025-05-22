import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';

const TransitionScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Após a transição visual, vamos para a LoadingScreen
      navigation.replace('Loading');
    }, 2000); // Simula um tempo de "transição visual" de 2 segundos

    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/loading.gif')} // **MESMO GIF DA LOADING SCREEN**
      style={styles.background}
      resizeMode="cover" // Garante que o GIF cubra toda a área
    >
      <View style={styles.overlay}> {/* Overlay para melhorar a legibilidade do texto */}
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando o mundo...</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // O estilo 'overlay' foi removido
  loadingText: {
    marginTop: 20,
    color: '#000000', // Cor branca para o texto
    fontSize: 18,
    textAlign: 'center',
    // Sombras mais fortes para destacar o texto
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
});

export default TransitionScreen;