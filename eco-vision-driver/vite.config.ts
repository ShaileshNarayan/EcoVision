import { defineConfig } from "vite";
import react from '@vitejs/plugin-react-swc'
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // your alias for imports
    },
  },
  server: {
    port: 5174, // <-- change this to any free port you like
    strictPort: true, // optional, throws error if port is taken
    host:true 
  },
});