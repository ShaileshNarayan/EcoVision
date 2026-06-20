import axios from "axios";

const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

const strapiClient = axios.create({
  baseURL: "http://localhost:1337/api",
  headers: STRAPI_TOKEN
    ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
    : {},
});

export default strapiClient;

