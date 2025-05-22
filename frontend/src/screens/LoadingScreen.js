import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    // Simula um carregamento de dados (e.g., carregar coleção de cartas, dados do perfil)
    const loadData = async () => {
      // Aqui você faria requisições de API, carregamento de assets, etc.
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simula 3 segundos de carregamento
      navigation.replace('MainTabs'); // Navega para a tela principal (menu)
    };

    loadData();
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/loading.gif')} // **SEU GIF AQUI**
      style={styles.background}
      resizeMode="cover" // Garante que o GIF cubra toda a área
    >
      <View style={styles.overlay}> {/* Overlay para melhorar a legibilidade do texto */}
        <ActivityIndicator size="large" color="#FFCB05" />
        <Text style={styles.loadingText}>Preparando sua jornada...</Text>
        <Text style={styles.subText}>Isso pode levar alguns instantes.</Text>
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
    color: '#00000', // Cor branca para o texto principal
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    // Sombras mais fortes para destacar o texto
    textShadowColor: 'rgba(0, 0, 0, 1)', // Cor preta com opacidade total
    textShadowOffset: { width: 2, height: 2 }, // Deslocamento da sombra
    textShadowRadius: 8, // Raio do desfoque da sombra
  },
  subText: {
    marginTop: 5,
    color: '#00000', // Uma cor ligeiramente mais clara para o subtítulo
    fontSize: 16,
    textAlign: 'center',
    // Sombras mais fortes para destacar o texto
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});

export default LoadingScreen;