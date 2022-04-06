import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

const getHello = () => {
  return axios.get(API_URL + 'hello', { headers: authHeader() });
};

const uploadFile = (file) => {
  let formData = new FormData();
  formData.append('file', file);
  return axios.post(API_URL + 'upload', formData, {
    headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
  });
};

const getFiles = () => {
  return axios.get(API_URL + 'files', { headers: authHeader() });
};

const userService = {
  getHello,
  uploadFile,
  getFiles,
};

export default userService;
