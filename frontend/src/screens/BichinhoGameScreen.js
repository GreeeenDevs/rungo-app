import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ImageBackground, TextInput, TouchableOpacity, Image } from 'react-native';
import Button from '../components/Button';
import BG from '../../assets/bgscream.gif';
import { getPetStatus, hatchPet, feedPet, playWithPet, sleepPet, updatePetHappiness, archivePet } from '../services/apiService';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar as imagens dos dinossauros (as mesmas da ShopScreen)
import dinoAzul from '../../assets/dinosaurs/dino_azul.png';
import dinoVermelho from '../../assets/dinosaurs/dino_vermelho.png';
import dinoRosa from '../../assets/dinosaurs/dino_rosa.png';
import dinoBranco from '../../assets/dinosaurs/dino_branco.png';
import dinoPreto from '../../assets/dinosaurs/dino_preto.png';
import eggImage from '../../assets/egg.png'; // Certifique-se de ter essa imagem
import babyImage from '../../assets/baby.png'; // Placeholder para filhote
import adultImage from '../../assets/adult.png'; // Placeholder para adulto
import oldImage from '../../assets/old.png'; // Placeholder para idoso

const dinosaurImages = {
  dino_azul: dinoAzul,
  dino_vermelho: dinoVermelho,
  dino_rosa: dinoRosa,
  dino_branco: dinoBranco,
  dino_preto: dinoPreto,
};

const BichinhoGameScreen = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [petName, setPetName] = useState('');
  const [showHatchInput, setShowHatchInput] = useState(false);
  const [stepsInput, setStepsInput] = useState('');
  const [dinossauroChocadoPeloGacha, setDinossauroChocadoPeloGacha] = useState(null);

  const fetchPetStatus = useCallback(async () => {
    setLoading(true);
    try {
      const petData = await getPetStatus();
      setPet(petData);
      setShowHatchInput(false);

      if (petData) {
        await AsyncStorage.removeItem('novoDinossauroChocado');
        setDinossauroChocadoPeloGacha(null);
      }

      if (petData.stage === 'Idoso') {
        Alert.alert(
          'Parabéns!',
          `${petData.name} atingiu a velhice! Ele foi adicionado à sua coleção. Agora você pode chocar um novo bichinho!`,
          [
            { text: 'OK', onPress: async () => {
              try {
                await archivePet();
                setPet(null);
                setShowHatchInput(true);
              } catch (error) {
                console.error("Erro ao arquivar pet:", error);
                Alert.alert('Erro', 'Não foi possível arquivar o bichinho. Tente novamente.');
              }
            }}
          ]
        );
      }

    } catch (error) {
      if (error.message.includes('Bichinho não encontrado') || error.message.includes('404')) {
        setPet(null);
        const novoDinoJson = await AsyncStorage.getItem('novoDinossauroChocado');
        if (novoDinoJson) {
          const novoDino = JSON.parse(novoDinoJson);
          setDinossauroChocadoPeloGacha(novoDino);
          setShowHatchInput(true);
        } else {
          setShowHatchInput(true);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPetStatus();
      const interval = setInterval(() => {
        fetchPetStatus();
      }, 60 * 1000);

      return () => clearInterval(interval);
    }, [fetchPetStatus])
  );

  const handleHatchPet = async () => {
    if (!petName.trim()) {
      Alert.alert('Erro', 'Por favor, dê um nome ao seu bichinho!');
      return;
    }

    let dinoIdToHatch = 'dino_azul';
    if (dinossauroChocadoPeloGacha) {
      dinoIdToHatch = dinossauroChocadoPeloGacha.id;
    }

    try {
      const hatchedPet = await hatchPet(petName, dinoIdToHatch);
      setPet(hatchedPet);
      Alert.alert('Sucesso', `Parabéns! Seu bichinho ${hatchedPet.name} (${dinossauroChocadoPeloGacha?.nome || 'ovo padrão'}) nasceu!`);
      setShowHatchInput(false);
      setDinossauroChocadoPeloGacha(null);
      await AsyncStorage.removeItem('novoDinossauroChocado');
    } catch (error) {
      console.error("Erro ao chocar pet:", error);
      Alert.alert('Erro', error.message || 'Não foi possível chocar o bichinho.');
    }
  };

  const handleFeed = async () => {
    try {
      const updatedPet = await feedPet();
      setPet(updatedPet);
      Alert.alert('Ação', `${updatedPet.name} foi alimentado!`);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível alimentar o bichinho.');
    }
  };

  const handlePlay = async () => {
    try {
      const updatedPet = await playWithPet();
      setPet(updatedPet);
      Alert.alert('Ação', `${updatedPet.name} adorou brincar!`);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível brincar com o bichinho.');
    }
  };

  const handleSleep = async () => {
    try {
      const updatedPet = await sleepPet();
      setPet(updatedPet);
      Alert.alert('Ação', `${updatedPet.name} tirou uma soneca e recuperou energia!`);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível fazer o bichinho dormir.');
    }
  };

  const handleUpdateHappiness = async () => {
    const parsedSteps = parseInt(stepsInput);
    if (isNaN(parsedSteps) || parsedSteps < 0) {
      Alert.alert('Erro', 'Por favor, insira um número válido de passos.');
      return;
    }
    try {
      const updatedPet = await updatePetHappiness(parsedSteps);
      setPet(updatedPet);
      setStepsInput('');
      Alert.alert('Sucesso', `Felicidade de ${updatedPet.name} atualizada com ${parsedSteps} passos!`);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível atualizar a felicidade.');
    }
  };

  const getPetImage = (stage, dinossauroId = null) => {
    if (dinossauroId && dinosaurImages[dinossauroId]) {
      return dinosaurImages[dinossauroId];
    }
    switch (stage) {
      case 'Ovo': return eggImage;
      case 'Filhote': return babyImage;
      case 'Adulto': return adultImage;
      case 'Idoso': return oldImage;
      default: return eggImage;
    }
  };

  if (loading) {
    return (
      <ImageBackground source={BG} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Carregando bichinho...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BG} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Meu RunGO</Text>

        {showHatchInput ? (
          <View style={styles.gameContainer}>
            <Text style={styles.bichinhoName}>
              {dinossauroChocadoPeloGacha ? `Um ${dinossauroChocadoPeloGacha.nome} apareceu!` : 'Um ovo misterioso apareceu!'}
            </Text>
            <Image
              source={dinossauroChocadoPeloGacha ? dinossauroChocadoPeloGacha.imagem : eggImage}
              style={styles.petImage}
              resizeMode="contain"
            />
            <Text style={styles.label}>Dê um nome ao seu novo amigo:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do RunGO"
              placeholderTextColor="#aaa"
              value={petName}
              onChangeText={setPetName}
            />
            <Button title="Chocar Ovo!" onPress={handleHatchPet} />
          </View>
        ) : (
          pet && (
            <View style={styles.gameContainer}>
              <Text style={styles.bichinhoName}>{pet.name}</Text>
              <Image source={getPetImage(pet.stage, pet.dinosaurId)} style={styles.petImage} resizeMode="contain" />

              <View style={styles.statsContainer}>
                <Text style={styles.statText}>Estágio: {pet.stage}</Text>
                <Text style={styles.statText}>Felicidade: {pet.happiness}%</Text>
                <Text style={styles.statText}>Fome: {pet.fome}%</Text>
                <Text style={styles.statText}>Energia: {pet.energia}%</Text>
                <Text style={styles.statText}>Passos de Vida: {pet.totalStepsLife}</Text>
              </View>

              <View style={styles.actionsContainer}>
                <Button title="Alimentar" onPress={handleFeed} />
                <Button title="Brincar" onPress={handlePlay} />
                <Button title="Dormir" onPress={handleSleep} />
              </View>

              <View style={styles.stepsUpdateContainer}>
                <Text style={styles.label}>Simular Passos:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Número de passos"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={stepsInput}
                  onChangeText={setStepsInput}
                />
                <Button title="Atualizar Felicidade por Passos" onPress={handleUpdateHappiness} />
              </View>
            </View>
          )
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
  loadingText: {
    color: '#FFCB05',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFCB05',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    textAlign: 'center',
  },
  gameContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
    width: '90%',
  },
  bichinhoName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFDE00',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  petImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#3D7DCA',
    borderWidth: 1,
  },
  statText: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  stepsUpdateContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
    textAlign: 'center',
  },
});

export default BichinhoGameScreen;