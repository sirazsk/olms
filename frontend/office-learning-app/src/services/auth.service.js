import axios from 'axios';

const API_URL = 'http://localhost:8080/';

const register = (fullName, email, password) => {
  return axios.post(API_URL + 'signup', {
    fullName,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + 'signin', {
      email,
      password,
    })
    .then((response) => {
      if (response.data.jwt) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
