import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import BG from '../../assets/bgscream.gif'


const CollectionScreen = () => {
  return (
    <ImageBackground source={BG} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Minha Coleção</Text>
        <Text style={styles.subtitle}>Seus Rungos estão aqui!</Text>
        {/* Conteúdo da coleção de cartas */}
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
});

export default CollectionScreen;