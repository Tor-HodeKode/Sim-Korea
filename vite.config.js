import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/Sim-Korea/", // Navnet på GitHub repo-et ditt
  plugins: [react()],
});
