import axios from "axios";

const Axios = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 1000,
});

axios.interceptors.request.use(
  (config) => {
    console.log("Request Interceptor", config);
    return config;
  },
  (error) => {
    console.log("Request Error Interceptor", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log("Response Interceptor", response);
    return response;
  },
  (error) => {
    console.log("Response Error Interceptor", error);
    return Promise.reject(error);
  }
);

export default Axios;
