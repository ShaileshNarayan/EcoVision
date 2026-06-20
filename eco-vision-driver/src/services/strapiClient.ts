import axios from "axios";
import { ENV } from "@/config/env";

const strapiClient = axios.create({
  baseURL: `${ENV.STRAPI_BASE_URL}/api`,
  headers: {
    Authorization: `Bearer ${ENV.STRAPI_API_TOKEN}`,
  },
});

export default strapiClient;