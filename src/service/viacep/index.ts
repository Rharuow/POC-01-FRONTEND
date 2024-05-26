import axios from "axios";

const viacepAPI = axios.create({
  baseURL: "https://viacep.com.br/ws",
});

export { viacepAPI };
