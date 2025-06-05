import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_BASE_URL = 'http://192.168.0.134:3000'; // Altere conforme necessário.

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
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || 'Ocorreu um erro no servidor.';

      if (response.status === 401 || response.status === 403) {
        await AsyncStorage.removeItem('jwt_token');
      }

      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    if (error.message.includes('Network request failed')) {
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão ou o endereço do backend.');
    } else {
      Alert.alert('Eita!', error.message);
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
  return apiCall('/api/pet/', 'GET');
};

// Novo: hatchPet aceita nome e dinosaurId
export const hatchPet = async (name, dinosaurId) => {
  return apiCall('/api/pet/hatch', 'POST', { name, dinosaurId });
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

// --- Funções de Coleção ---
export const archivePet = async () => {
  // Não precisa de argumento, pois o backend usa o usuário autenticado
  return apiCall(`/api/pet/archive`, 'POST');
};

export const getCollectedDinos = async () => {
  // Espera um array no retorno!
  return apiCall('/api/pet/collection', 'GET');
};