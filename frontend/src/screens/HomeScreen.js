// ./src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Bichinho {
  constructor(nome, estagio, felicidade, fome, energia) {
    this.nome = nome;
    this.estagio = estagio; // Filhote, Adulto, Idoso
    this.felicidade = felicidade; // Nível de felicidade (0-100)
    this.fome = fome; // Nível de fome (0-100)
    this.energia = energia; // Nível de energia (0-100)
  }

  alimentar() {
    this.fome = Math.max(0, this.fome - 20);
    this.felicidade = Math.min(100, this.felicidade + 10);
    this.energia = Math.min(100, this.energia + 5);
    console.log(`${this.nome} foi alimentado.`);
  }

  brincar() {
    this.felicidade = Math.min(100, this.felicidade + 15);
    this.fome = Math.min(100, this.fome + 10);
    this.energia = Math.max(0, this.energia - 15);
    console.log(`${this.nome} brincou.`);
  }

  descansar() {
    this.energia = Math.min(100, this.energia + 25);
    this.fome = Math.min(100, this.fome + 5);
    console.log(`${this.nome} descansou.`);
  }

  atualizarEstado() {
    const eventoAleatorio = Math.random();

    if (eventoAleatorio < 0.2) {
      this.fome = Math.min(100, this.fome + 10);
      console.log(`${this.nome} está com mais fome.`);
    } else if (eventoAleatorio < 0.4) {
      this.energia = Math.max(0, this.energia - 5);
      console.log(`${this.nome} está um pouco cansado.`);
    } else if (eventoAleatorio < 0.1) {
      this.felicidade = Math.max(0, this.felicidade - 10);
      console.log(`${this.nome} parece triste.`);
    }

    if (this.estagio === 'Filhote' && this.energia > 90 && this.fome < 20 && this.felicidade > 80) {
      this.estagio = 'Adulto';
      console.log(`${this.nome} cresceu e se tornou um adulto!`);
    }
  }
}

class Ovo {
  constructor(id, tipo) {
    this.id = id;
    this.tipo = tipo;
  }

  eclosao() {
    const tiposDeBichinho = ['Cachorro', 'Gato', 'Pássaro'];
    const indiceAleatorio = Math.floor(Math.random() * tiposDeBichinho.length);
    return new Bichinho(tiposDeBichinho[indiceAleatorio], 'Filhote', 50, 50, 50);
  }
}

const HomeScreen = ({ navigation, setLoggedIn }) => {
  const [bichinho, setBichinho] = useState(null);

  const handleSelecionarOvo = useCallback((tipoOvo) => {
    const ovoSelecionado = new Ovo(1, tipoOvo);
    setBichinho(ovoSelecionado.eclosao());
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Loja" onPress={() => navigation.navigate('Store', { onOvoSelecionado: handleSelecionarOvo })} />
      ),
    });
  }, [navigation, handleSelecionarOvo]);

  useEffect(() => {
    if (bichinho) {
      const intervalId = setInterval(() => {
        setBichinho(prevBichinho => {
          const novoBichinho = new Bichinho(
            prevBichinho.nome,
            prevBichinho.estagio,
            prevBichinho.felicidade,
            prevBichinho.fome,
            prevBichinho.energia
          );
          novoBichinho.atualizarEstado();
          return novoBichinho;
        });
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [bichinho]);

  const handleAlimentar = useCallback(() => {
    setBichinho(prev => {
      if (prev) {
        const b = new Bichinho(prev.nome, prev.estagio, prev.felicidade, prev.fome, prev.energia);
        b.alimentar();
        return b;
      }
      return null;
    });
  }, []);

  const handleBrincar = useCallback(() => {
    setBichinho(prev => {
      if (prev) {
        const b = new Bichinho(prev.nome, prev.estagio, prev.felicidade, prev.fome, prev.energia);
        b.brincar();
        return b;
      }
      return null;
    });
  }, []);

  const handleDescansar = useCallback(() => {
    setBichinho(prev => {
      if (prev) {
        const b = new Bichinho(prev.nome, prev.estagio, prev.felicidade, prev.fome, prev.energia);
        b.descansar();
        return b;
      }
      return null;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      setLoggedIn(false);
    } catch (error) {
      console.error("Erro ao sair:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao sair.');
    }
  }, [setLoggedIn]);

  return (
    <View style={styles.container}>
      {!bichinho ? (
        <Text style={styles.selecioneOvo}>Vá para a Loja e selecione um ovo!</Text>
      ) : (
        <View style={styles.bichinhoContainer}>
          <Text style={styles.nome}>Nome: {bichinho.nome}</Text>
          <Text style={styles.info}>Estágio: {bichinho.estagio}</Text>
          <Text style={styles.info}>Felicidade: {bichinho.felicidade}</Text>
          <Text style={styles.info}>Fome: {bichinho.fome}</Text>
          <Text style={styles.info}>Energia: {bichinho.energia}</Text>
          <View style={styles.acoesContainer}>
            <Button title="Alimentar" onPress={handleAlimentar} />
            <Button title="Brincar" onPress={handleBrincar} />
            <Button title="Descansar" onPress={handleDescansar} />
          </View>
        </View>
      )}
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  selecioneOvo: {
    fontSize: 18,
    textAlign: 'center',
  },
  bichinhoContainer: {
    alignItems: 'center',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  acoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default HomeScreen;