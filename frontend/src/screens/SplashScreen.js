import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ImageBackground,
  TouchableWithoutFeedback, // Importe este componente
} from 'react-native';
import BG from '../../assets/bgscream.gif'


const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valor inicial para opacidade
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // Valor inicial para escala

  useEffect(() => {
    // Animação inicial do texto "Rungo APP"
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500, // Fade-in mais longo para o texto
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(); // Inicia a animação e o texto permanece visível
  }, [fadeAnim, scaleAnim]);

  const handlePress = () => {
    // Ao invés de um timer, a navegação ocorre no toque
    // Podemos adicionar uma animação de fade-out aqui antes de navegar, se desejar
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500, // Fade-out rápido ao tocar
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace('Transition'); // Navega para a tela de transição
    });
  };

  return (
    <ImageBackground
      // Certifique-se que 'splash_background.gif' é o nome exato do seu arquivo
      source={BG}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.overlay}>
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text>Rungo APP</Text>
          </Animated.Text>
          <Text style={styles.tapToStartText}>Toque para Começar</Text>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFCB05',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 10,
    textAlign: 'center',
    marginBottom: 20, // Espaço entre o título e o texto "Toque para Começar"
  },
  tapToStartText: {
    fontSize: 18,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});

export default SplashScreen;