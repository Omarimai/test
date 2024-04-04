import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Your backend base URL
    timeout: 5000, // Timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
    },
});
