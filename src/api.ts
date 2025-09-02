import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.0.4:9000", // ← PC의 IPv4 주소
  headers: { "Content-Type": "application/json" },
});

export default API;
