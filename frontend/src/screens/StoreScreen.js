// ./src/screens/StoreScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const OvosDisponiveis = [
  { id: 'comum', tipo: 'Comum', descricao: 'Um ovo simples.' },
  { id: 'raro', tipo: 'Raro', descricao: 'Um ovo com potencial.' },
  { id: 'lendario', tipo: 'Lendário', descricao: 'Um ovo misterioso.' },
];

const StoreScreen = ({ navigation, route }) => {
  const { onOvoSelecionado } = route.params || {};

  const handleSelecionarOvo = (tipoOvo) => {
    if (onOvoSelecionado) {
      onOvoSelecionado(tipoOvo);
      navigation.goBack(); // Retorna para a tela anterior (HomeScreen)
    } else {
      Alert.alert('Erro', 'A função para selecionar o ovo não foi passada corretamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione um Ovo</Text>
      {OvosDisponiveis.map((ovo) => (
        <View key={ovo.id} style={styles.ovoItem}>
          <Text style={styles.ovoTipo}>{ovo.tipo}</Text>
          <Text style={styles.ovoDescricao}>{ovo.descricao}</Text>
          <Button title={`Escolher ${ovo.tipo}`} onPress={() => handleSelecionarOvo(ovo.tipo)} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ovoItem: {
    marginBottom: 15,
    alignItems: 'center',
  },
  ovoTipo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ovoDescricao: {
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default StoreScreen;