// src/config/env.ts

export const ENV = {
  STRAPI_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  STRAPI_API_TOKEN: import.meta.env.VITE_STRAPI_API_TOKEN,
  BACKEND_API_URL: import.meta.env.VITE_BACKEND_API_URL,
} as const;

// Safety check
if (!ENV.STRAPI_BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL is not defined");
}
