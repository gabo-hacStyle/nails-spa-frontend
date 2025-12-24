import axios from 'axios'

const BASE_URL = process.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000/api/v1';

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true 
})
//Console de las credenciales:
console.log("Axios instance created with baseURL:", instance.defaults.baseURL);
console.log("Axios instance withCredentials:", instance.defaults.withCredentials);
export default instance