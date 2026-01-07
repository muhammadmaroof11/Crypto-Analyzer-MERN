import axios from 'axios';

const api = axios.create({
  baseURL: 'https://crypto-api-p20v.onrender.com/api', 
});

export default api;