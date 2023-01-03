import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/crypto-bots/",
  plugins: [tsconfigPaths(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          reactModal: ["react-modal"],
          axios: ["axios"],
        },
      },
    },
  },
});
