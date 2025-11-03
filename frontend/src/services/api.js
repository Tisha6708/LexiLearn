// frontend/src/services/api.js
import api from "../api/axios";

export default {
  get: (url, opts) => api.get(url, opts),
  post: (url, body, opts) => api.post(url, body, opts),
  put: (url, body, opts) => api.put(url, body, opts),
  delete: (url, opts) => api.delete(url, opts),
  setToken: (token) => api.setToken(token),
  clearToken: () => api.clearToken(),
};
