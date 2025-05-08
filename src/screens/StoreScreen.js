import React from 'react';
import { View, Text, Button } from 'react-native';

const StoreScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Bem-vindo à Loja!</Text>
      <Button title="Voltar para Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default StoreScreen;
