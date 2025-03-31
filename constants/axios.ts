import axios from "axios";
import environment from "@/constants/environment";

const axiosInstance = axios.create({
  baseURL: environment.API_URL, // Set the base URL for all requests
  headers: {
    "Content-Type": "application/json", // Set the content type for all requests
  },
  withCredentials: true, // Allow cookies or credentials to be sent with requests
});

export default axiosInstance;
