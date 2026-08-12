import axios from 'axios';

// NOTE: For physical devices, you must change this to your computer's local IP address (e.g. 192.168.1.xxx)
export const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
