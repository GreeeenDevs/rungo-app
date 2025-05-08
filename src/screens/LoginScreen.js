import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { auth, db } from '../config/firebaseConfig'; // Importe o db
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Importe as funções do Firestore
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        // Busca os dados do usuário no Firestore usando o UID
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          // Aqui você pode usar os dados do usuário (userData) conforme necessário
          console.log('Dados do usuário logado:', userData);
          await AsyncStorage.setItem('jwt_token', user.uid);
          navigation.replace('Home'); // Direciona para Home
        } else {
          Alert.alert('Erro', 'Dados do usuário não encontrados no banco de dados.');
          // Opcional: Desconectar o usuário se os dados não forem encontrados
          // auth.signOut();
        }
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View>
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Senha:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Cadastrar" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LoginScreen;