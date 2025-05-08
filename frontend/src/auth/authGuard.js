// ./src/auth/authGuard.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    console.log("authGuard.js: Token encontrado =", token);
    return !!token;
  } catch (error) {
    console.error("authGuard.js: Erro ao verificar token:", error);
    return false;
  }
};

export default isAuthenticated;