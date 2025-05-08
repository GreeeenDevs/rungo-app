import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { auth, db } from '../config/firebaseConfig'; // Importe o db
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore'; // Importe as funções do Firestore

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCadastro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        // Adicionando dados do usuário ao Firestore
        const usersCollection = collection(db, 'users'); // 'users' é o nome da sua coleção
        await addDoc(usersCollection, {
          uid: user.uid, // Adiciona o UID do usuário autenticado
          email: email,
          // Adicione outros dados que você queira armazenar (nome, etc.)
        });
        Alert.alert('Sucesso', 'Cadastro realizado e dados salvos! Faça o login.');
        navigation.navigate('Login');
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
      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
};

export default RegisterScreen;