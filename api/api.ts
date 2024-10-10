import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://localhost:5001/api";

class Api {
  apiInstance: AxiosInstance;

  constructor() {
    this.apiInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
          "Content-Type": "application/json",
          
      },
    });
  }
}

const api = new Api();
export default api.apiInstance;