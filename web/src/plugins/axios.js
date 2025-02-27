import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
  timeout: 50000,
  headers: { 'X-Custom-Header': 'foobar' }
});

const get = (url, params) => instance.get(url, { params });
const post = (url, data) => instance.post(url, data);

export default {
  get,
  post
};
