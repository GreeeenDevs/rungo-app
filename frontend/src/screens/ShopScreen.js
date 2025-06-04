// src/screens/ShopScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import Button from '../components/Button';
import BG from '../../assets/bgscream.gif';

// Importar as imagens dos dinossauros
// VOCÊ PRECISA TER ESSAS IMAGENS NA PASTA assets/dinosaurs/ (ou ajuste o caminho)
import dinoAzul from '../../assets/dinosaurs/dino_azul.gif';   // Crie essas pastas e adicione as imagens
import dinoVermelho from '../../assets/dinosaurs/dino_vermelho.gif';
import dinoRosa from '../../assets/dinosaurs/dino_rosa.gif';
import dinoBranco from '../../assets/dinosaurs/dino_branco.gif';
import dinoPreto from '../../assets/dinosaurs/dino_preto.gif';
import eggImage from '../../assets/egg.gif'; // Imagem de um ovo genérico

const custoGacha = 100; // Custo para chocar um ovo

const DinossaurosComuns = [
  { id: 'dino_azul', nome: 'Dinossauro Azul', imagem: dinoAzul },
  { id: 'dino_vermelho', nome: 'Dinossauro Vermelho', imagem: dinoVermelho },
  { id: 'dino_rosa', nome: 'Dinossauro Rosa', imagem: dinoRosa },
];

const DinossaurosRaros = [
  { id: 'dino_branco', nome: 'Dinossauro Branco', imagem: dinoBranco },
  { id: 'dino_preto', nome: 'Dinossauro Preto', imagem: dinoPreto },
];

const ShopScreen = ({ navigation }) => {
  const [moedas, setMoedas] = useState(500); // Moedas iniciais do jogador
  const [ultimoDinossauroChocado, setUltimoDinossauroChocado] = useState(null); // Para exibir o resultado

  const handleChocarOvo = () => {
    if (moedas < custoGacha) {
      Alert.alert('Saldo Insuficiente', 'Você não tem moedas suficientes para chocar um ovo!');
      return;
    }

    setMoedas(prevMoedas => prevMoedas - custoGacha); // Deduz o custo

    const probabilidadeRaro = 0.3; // 30% de chance de vir raro
    const isRaro = Math.random() < probabilidadeRaro;

    let dinossauroChocado;
    if (isRaro) {
      dinossauroChocado = DinossaurosRaros[Math.floor(Math.random() * DinossaurosRaros.length)];
      Alert.alert('Parabéns!', `Você chocou um DINOSSAURO RARO: ${dinossauroChocado.nome}!`);
    } else {
      dinossauroChocado = DinossaurosComuns[Math.floor(Math.random() * DinossaurosComuns.length)];
      Alert.alert('Bom!', `Você chocou um DINOSSAURO COMUM: ${dinossauroChocado.nome}.`);
    }

    setUltimoDinossauroChocado(dinossauroChocado);

    // TODO: Aqui você precisaria implementar a lógica para "adicionar"
    // este dinossauro à coleção do usuário ou associá-lo ao pet existente.
    // Isso pode ser feito via Context API, Redux ou chamadas à sua API de backend.
    console.log(`Dinossauro chocado: ${dinossauroChocado.nome}`);
  };

  return (
    <ImageBackground source={BG} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Loja de Ovos - Gacha</Text>
        <Text style={styles.subtitle}>Sua Moedas: ${moedas}</Text>

        <View style={styles.gachaContainer}>
          <Text style={styles.gachaInfo}>Custo por Ovo: ${custoGacha}</Text>
          <Text style={styles.gachaProb}>Chance de Raro: 30%</Text>
          <Image source={eggImage} style={styles.gachaEggImage} />
          <Button title="Chocar Ovo!" onPress={handleChocarOvo} />
        </View>

        {ultimoDinossauroChocado && (
          <View style={styles.resultadoContainer}>
            <Text style={styles.resultadoTitle}>Você Chocou:</Text>
            <Image source={ultimoDinossauroChocado.imagem} style={styles.resultadoDinoImage} resizeMode="contain" />
            <Text style={styles.resultadoDinoNome}>{ultimoDinossauroChocado.nome}</Text>
            <Text style={styles.resultadoDinoTipo}>{ultimoDinossauroChocado.id.includes('raro') ? 'Tipo: Raro' : 'Tipo: Comum'}</Text>
          </View>
        )}

        <View style={styles.dinoListContainer}>
            <Text style={styles.listTitle}>Dinossauros Comuns Possíveis:</Text>
            <View style={styles.dinoGrid}>
                {DinossaurosComuns.map(dino => (
                    <View key={dino.id} style={styles.dinoGridItem}>
                        <Image source={dino.imagem} style={styles.dinoGridImage} />
                        <Text style={styles.dinoGridText}>{dino.nome.replace('Dinossauro ', '')}</Text>
                    </View>
                ))}
            </View>
            <Text style={[styles.listTitle, { marginTop: 20 }]}>Dinossauros Raros Possíveis:</Text>
            <View style={styles.dinoGrid}>
                {DinossaurosRaros.map(dino => (
                    <View key={dino.id} style={styles.dinoGridItem}>
                        <Image source={dino.imagem} style={styles.dinoGridImage} />
                        <Text style={styles.dinoGridText}>{dino.nome.replace('Dinossauro ', '')}</Text>
                    </View>
                ))}
            </View>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    fontSize: 24, // Aumentado para moedas
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gachaContainer: {
    backgroundColor: 'rgba(44, 62, 80, 0.8)',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#3D7DCA',
  },
  gachaInfo: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  gachaProb: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 20,
  },
  gachaEggImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  resultadoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    width: '90%',
    borderWidth: 1,
    borderColor: '#FFDE00',
  },
  resultadoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFDE00',
    marginBottom: 15,
  },
  resultadoDinoImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  resultadoDinoNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  resultadoDinoTipo: {
    fontSize: 16,
    color: '#CCC',
  },
  dinoListContainer: {
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFCB05',
    marginBottom: 15,
    textAlign: 'center',
  },
  dinoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dinoGridItem: {
    alignItems: 'center',
    margin: 10,
    width: 80, // Tamanho fixo para a célula da grade
  },
  dinoGridImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  dinoGridText: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center',
  },
});

export default ShopScreen;