// PetHappinessApp/src/services/apiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Mude este IP para o IP da sua máquina ou 'localhost' se estiver no emulador e o backend rodando localmente.
// Verifique o IP do seu computador na rede local (ex: ipconfig no Windows, ifconfig no Linux/macOS).
const API_BASE_URL = 'http://10.68.76.230:3000'; // Exemplo: MUDAR PARA O SEU IP

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('jwt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const apiCall = async (endpoint, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(await getAuthHeaders()),
  };

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      // Se a resposta não for OK (status 4xx ou 5xx)
      const errorMessage = responseData.message || 'Ocorreu um erro no servidor.';
      Alert.alert('Erro na Requisição', errorMessage);
      // Se for 403 ou 401, o token pode ser inválido, podemos forçar o logout
      if (response.status === 401 || response.status === 403) {
        await AsyncStorage.removeItem('jwt_token'); // Limpa o token inválido
        // Poderia emitir um evento ou navegar para a tela de login aqui
        // Para simplificar, o App.js vai verificar o token e navegar
      }
      throw new Error(errorMessage);
    }
    return responseData;
  } catch (error) {
    console.error(`Erro ao chamar API ${endpoint}:`, error);
    if (error.message.includes('Network request failed')) {
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão ou o endereço do backend.');
    } else {
      Alert.alert('Erro', error.message);
    }
    throw error;
  }
};

// --- Funções de Autenticação ---
export const loginUser = async (username, password) => {
  return apiCall('/auth/login', 'POST', { username, password });
};

export const registerUser = async (username, password) => {
  return apiCall('/auth/register', 'POST', { username, password });
};

// --- Funções do Pet ---
export const getPetStatus = async () => {
  return apiCall('/api/pet');
};

export const hatchPet = async (name) => {
  return apiCall('/api/pet/hatch', 'POST', { name });
};

export const feedPet = async () => {
  return apiCall('/api/pet/feed', 'POST');
};

export const playWithPet = async () => {
  return apiCall('/api/pet/play', 'POST');
};

export const sleepPet = async () => {
  return apiCall('/api/pet/sleep', 'POST');
};

export const updatePetHappiness = async (steps) => {
  return apiCall('/api/pet/updateHappiness', 'POST', { steps });
};