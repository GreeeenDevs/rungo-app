import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Alert } from 'react-native';
// Certifique-se de que o componente Button esteja em '../components/Button'
import Button from '../components/Button';

const OvosDisponiveis = [
  { id: 'comum', tipo: 'Comum', descricao: 'Um ovo simples e leal.', preco: 100 },
  { id: 'raro', tipo: 'Raro', descricao: 'Um ovo com potencial oculto.', preco: 500 },
  { id: 'lendario', tipo: 'Lendário', descricao: 'Um ovo misterioso, lendas o cercam.', preco: 2000 },
];

const ShopScreen = ({ navigation }) => { // Removido 'route' por enquanto
  // A função para selecionar o ovo não será passada via route.params diretamente aqui,
  // pois estamos na tela da aba. O gerenciamento do ovo escolhido precisará ser feito de outra forma (ex: context API, Redux)
  // ou a loja poderia estar em uma stack separada navegando de BichinhoGameScreen.

  const handleComprarOvo = (ovoTipo) => {
    // Por enquanto, apenas um alerta de que o ovo foi 'comprado'.
    // A lógica real de "dar o ovo para o bichinho" viria aqui ou em um gerenciamento de estado global.
    Alert.alert(
      'Compra de Ovo',
      `Você comprou o Ovo ${ovoTipo}!`,
      [
        { text: 'OK', onPress: () => console.log(`Ovo ${ovoTipo} comprado.`) },
      ],
      { cancelable: false }
    );

    // Se você quisesse navegar para a tela do bichinho após a compra e passar o ovo:
    // navigation.navigate('MainTabs', { screen: 'Meu Bichinho', params: { novoOvoTipo: ovoTipo } });
    // Isso exigiria que 'Meu Bichinho' (BichinhoGameScreen) soubesse como receber esse parâmetro.
  };

  return (
    <ImageBackground source={require('../assets/bgscream.gif')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Loja de Ovos</Text>
        <Text style={styles.subtitle}>Escolha seu próximo companheiro!</Text>

        <View style={styles.ovosContainer}>
          {OvosDisponiveis.map((ovo) => (
            <View key={ovo.id} style={styles.ovoItem}>
              <Text style={styles.ovoTipo}>{ovo.tipo}</Text>
              <Text style={styles.ovoDescricao}>{ovo.descricao}</Text>
              <Text style={styles.ovoPreco}>Preço: ${ovo.preco}</Text>
              <Button title={`Comprar ${ovo.tipo}`} onPress={() => handleComprarOvo(ovo.tipo)} />
            </View>
          ))}
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
    backgroundColor: 'rgba(0,0,0,0.6)', // Fundo mais escuro para o conteúdo
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFCB05', // Amarelo Pokémon
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
  ovosContainer: {
    width: '90%', // Limita a largura para centralizar o conteúdo
    alignItems: 'center',
  },
  ovoItem: {
    backgroundColor: 'rgba(44, 62, 80, 0.8)', // Fundo para cada item de ovo
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#3D7DCA', // Borda azul
  },
  ovoTipo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFDE00', // Amarelo vibrante
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ovoDescricao: {
    fontSize: 16,
    color: '#ECF0F1', // Branco acinzentado
    marginBottom: 10,
    textAlign: 'center',
  },
  ovoPreco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ECC71', // Verde para o preço
    marginBottom: 15,
  },
  // O estilo do Button é importado de '../components/Button'
});

export default ShopScreen;