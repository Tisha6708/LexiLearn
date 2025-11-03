import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: false,
});

let currentToken = null;

api.setToken = (token) => {
  currentToken = token;
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

api.clearToken = () => {
  currentToken = null;
  delete api.defaults.headers.common["Authorization"];
};

export default api;
