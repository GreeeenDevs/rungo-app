import React from 'react';
import { View, Text, Button } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Configurações da Conta</Text>
      <Button title="Voltar para Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default SettingsScreen;
