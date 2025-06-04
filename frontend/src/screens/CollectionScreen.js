// src/screens/CollectionScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, Image, ActivityIndicator } from 'react-native';
import BG from '../../assets/bgscream.gif';
import { useFocusEffect } from '@react-navigation/native';
import { getCollectedDinos } from '../services/apiService'; // Importe a nova função

// Importar as imagens dos dinossauros (as mesmas da ShopScreen e BichinhoGameScreen)
import dinoAzul from '../../assets/dinosaurs/dino_azul';
import dinoVermelho from '../../assets/dinosaurs/dino_vermelho';
import dinoRosa from '../../assets/dinosaurs/dino_rosa';
import dinoBranco from '../../assets/dinosaurs/dino_branco';
import dinoPreto from '../../assets/dinosaurs/dino_preto';


// Mapeamento para obter a imagem do dinossauro pelo ID
const dinosaurImages = {
  dino_azul: dinoAzul,
  dino_vermelho: dinoVermelho,
  dino_rosa: dinoRosa,
  dino_branco: dinoBranco,
  dino_preto: dinoPreto,
};


const CollectionScreen = () => {
  const [collectedDinos, setCollectedDinos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollectedDinos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCollectedDinos(); // Chama a API para buscar a coleção
      setCollectedDinos(data);
    } catch (error) {
      console.error("Erro ao buscar coleção:", error);
      Alert.alert('Erro', error.message || 'Não foi possível carregar sua coleção.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect( // Recarrega sempre que a tela for focada
    useCallback(() => {
      fetchCollectedDinos();
      return () => {}; // Cleanup function
    }, [fetchCollectedDinos])
  );

  if (loading) {
    return (
      <ImageBackground source={BG} style={styles.background}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#FFCB05" />
          <Text style={styles.loadingText}>Carregando coleção...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BG} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Minha Coleção</Text>
        <Text style={styles.subtitle}>Seus Rungos colecionados!</Text>

        {collectedDinos.length === 0 ? (
          <Text style={styles.noDinosText}>Você ainda não tem Rungos na sua coleção. Choque alguns!</Text>
        ) : (
          <View style={styles.dinoGrid}>
            {collectedDinos.map((dino) => (
              <View key={dino._id} style={styles.dinoGridItem}>
                <Image
                  source={dinosaurImages[dino.dinosaurId] || dinoAzul} // Usa a imagem pelo ID, default se não encontrar
                  style={styles.dinoGridImage}
                  resizeMode="contain"
                />
                <Text style={styles.dinoGridText}>{dino.name}</Text>
                <Text style={styles.dinoGridSubText}>{dino.dinosaurId.replace('dino_', '')}</Text>
              </View>
            ))}
          </View>
        )}
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
  loadingText: {
    color: '#FFCB05',
    marginTop: 10,
    fontSize: 18,
  },
  noDinosText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  dinoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  dinoGridItem: {
    backgroundColor: 'rgba(44, 62, 80, 0.8)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    margin: 8,
    width: 120, // Ajuste o tamanho do item na grade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dinoGridImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  dinoGridText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFDE00',
    textAlign: 'center',
  },
  dinoGridSubText: {
    fontSize: 12,
    color: '#ECF0F1',
    textAlign: 'center',
  },
});

export default CollectionScreen;