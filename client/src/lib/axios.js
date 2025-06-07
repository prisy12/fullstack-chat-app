import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api" // ✅ your backend port is 5000
      : "/api",
  withCredentials: true,
});
