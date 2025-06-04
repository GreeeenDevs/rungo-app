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

const getAuthToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

const getPetStatus = async () => {
  const token = await getAuthToken();
  if (!token) throw new Error('Usuário não autenticado.');

  const response = await fetch(`${API_BASE_URL}/api/pet`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    throw new Error('Bichinho não encontrado. Crie um novo!');
  }
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao buscar status do pet.');
  }
  return response.json();
};
const hatchPet = async (name, dinosaurId = 'default_egg') => {
  const token = await getAuthToken();
  if (!token) throw new Error('Usuário não autenticado.');

  const response = await fetch(`${API_BASE_URL}/api/pet/hatch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, dinosaurId }), // Envia o dinosaurId
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao chocar o bichinho.');
  }
  return response.json();
};

const feedPet = async () => {
  const token = await getAuthToken();
  if (!token) throw new Error('Usuário não autenticado.');

  const response = await fetch(`${API_BASE_URL}/api/pet/feed`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao alimentar o bichinho.');
  }
  return response.json();
};

const playWithPet = async () => {
  const token = await getAuthToken();
  if (!token) throw new Error('Usuário não autenticado.');

  const response = await fetch(`${API_BASE_URL}/api/pet/play`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao brincar com o bichinho.');
  }
  return response.json();
};

const sleepPet = async () => {
  const token = await getAuthToken();
  if (!token) throw new Error('Usuário não autenticado.');

  const response = await fetch(`${API_BASE_URL}/api/pet/sleep`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao fazer o bichinho dormir.');
  }
  return response.json();
};

const updatePetHappiness = async (steps) => {
  const token = await getAuthToken();
  if (!token) throw new Error('Usuário não autenticado.');

  const response = await fetch(`${API_BASE_URL}/api/pet/update-happiness`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ steps }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao atualizar felicidade do bichinho.');
  }
  return response.json();
};
// NOVA FUNÇÃO: Para registrar um pet como colecionado
const archivePet = async (petId) => {
  const token = await getAuthToken();
  if (!token) throw new Error('Usuário não autenticado.');

  const response = await fetch(`${API_BASE_URL}/api/pet/archive/${petId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao arquivar o bichinho para coleção.');
  }
  return response.json(); // Retorna o pet arquivado ou uma confirmação
};

// NOVA FUNÇÃO: Para obter os dinossauros colecionados
const getCollectedDinos = async () => {
  const token = await getAuthToken();
  if (!token) throw new Error('Usuário não autenticado.');

  const response = await fetch(`${API_BASE_URL}/api/collection`, { // Nova rota para a coleção
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao buscar coleção de dinossauros.');
  }
  return response.json(); // Retorna a lista de dinossauros colecionados
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

export {
  getPetStatus,
  hatchPet,
  feedPet,
  playWithPet,
  sleepPet,
  updatePetHappiness,
  archivePet, 
  getCollectedDinos 
};