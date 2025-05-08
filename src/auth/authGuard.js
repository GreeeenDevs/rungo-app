import AsyncStorage from '@react-native-async-storage/async-storage';

const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('jwt_token');
  return token !== null;
};

export default isAuthenticated;
