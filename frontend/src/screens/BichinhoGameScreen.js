import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ImageBackground } from 'react-native';
import Button from '../components/Button'; // Importe o componente de botão
import BG from '../../assets/bgscream.gif'

// Definição da classe Bichinho (sem alterações na lógica)
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
    Alert.alert('Ação', `${this.nome} foi alimentado.`);
  }

  brincar() {
    this.felicidade = Math.min(100, this.felicidade + 15);
    this.fome = Math.min(100, this.fome + 10);
    this.energia = Math.max(0, this.energia - 15);
    Alert.alert('Ação', `${this.nome} brincou.`);
  }

  descansar() {
    this.energia = Math.min(100, this.energia + 25);
    this.fome = Math.min(100, this.fome + 5);
    Alert.alert('Ação', `${this.nome} descansou.`);
  }

  atualizarEstado() {
    const eventoAleatorio = Math.random();

    if (eventoAleatorio < 0.2) {
      this.fome = Math.min(100, this.fome + 10);
    } else if (eventoAleatorio < 0.4) {
      this.energia = Math.max(0, this.energia - 5);
    } else if (eventoAleatorio < 0.6) {
      this.felicidade = Math.max(0, this.felicidade - 10);
    }

    if (this.estagio === 'Filhote' && this.energia > 90 && this.fome < 20 && this.felicidade > 80) {
      this.estagio = 'Adulto';
      Alert.alert('Evolução!', `${this.nome} cresceu e se tornou um adulto!`);
    }
  }
}

// Definição da classe Ovo (sem alterações na lógica)
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

const BichinhoGameScreen = ({ navigation }) => {
  const [bichinho, setBichinho] = useState(null);

  const selecionarOvo = (tipoOvo) => {
    const ovoSelecionado = new Ovo(1, tipoOvo);
    setBichinho(ovoSelecionado.eclosao());
  };

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

  return (
    <ImageBackground source={BG} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Removido o botão de voltar, pois agora estará em uma aba */}
        {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'< Voltar'}</Text>
        </TouchableOpacity> */}

        {!bichinho ? (
          <View style={styles.selectionContainer}>
            <Text style={styles.title}>Selecione um Ovo</Text>
            <Button title="Ovo Comum" onPress={() => selecionarOvo('comum')} />
            <Button title="Ovo Raro" onPress={() => selecionarOvo('raro')} />
          </View>
        ) : (
          <View style={styles.gameContainer}>
            <Text style={styles.bichinhoName}>{bichinho.nome}</Text>
            <Text style={styles.statusText}>Estágio: {bichinho.estagio}</Text>
            <Text style={styles.statusText}>Felicidade: {bichinho.felicidade}</Text>
            <Text style={styles.statusText}>Fome: {bichinho.fome}</Text>
            <Text style={styles.statusText}>Energia: {bichinho.energia}</Text>

            <View style={styles.actionsContainer}>
              <Button
                title="Alimentar"
                onPress={() => setBichinho(prev => {
                  const b = new Bichinho(prev.nome, prev.estagio, prev.felicidade, prev.fome, prev.energia);
                  b.alimentar();
                  return b;
                })}
              />
              <Button
                title="Brincar"
                onPress={() => setBichinho(prev => {
                  const b = new Bichinho(prev.nome, prev.estagio, prev.felicidade, prev.fome, prev.energia);
                  b.brincar();
                  return b;
                })}
              />
              <Button
                title="Descansar"
                onPress={() => setBichinho(prev => {
                  const b = new Bichinho(prev.nome, prev.estagio, prev.felicidade, prev.fome, prev.energia);
                  b.descansar();
                  return b;
                })}
              />
            </View>
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
    backgroundColor: 'rgba(0,0,0,0.4)', // Overlay escuro para melhorar a legibilidade
  },
  // backButton e backButtonText removidos pois não serão mais necessários com Tab Navigation
  selectionContainer: {
    alignItems: 'center',
    marginTop: 50, // Ajuste para o conteúdo não ficar tão próximo ao topo
  },
  title: {
    fontSize: 32, // Um pouco menor que o título da Home, mas ainda grande
    fontWeight: 'bold',
    color: '#FFCB05', // Amarelo Pokémon
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    textAlign: 'center',
  },
  gameContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)', // Fundo semi-transparente para o container do jogo
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  bichinhoName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFDE00', // Amarelo vibrante do tema
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  statusText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionsContainer: {
    flexDirection: 'column', // Coloquei em coluna para melhor layout com os botões customizados
    marginTop: 30,
    width: '80%', // Largura dos botões
  },
  // O componente 'Button' já tem seus próprios estilos, então actionButton não é mais necessário aqui
});

export default BichinhoGameScreen;