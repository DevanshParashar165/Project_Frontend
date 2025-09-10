import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true, // if you're using HTTP-only cookies
});

export default API;