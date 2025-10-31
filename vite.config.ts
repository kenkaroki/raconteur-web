import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/raconteur-web/", // must match your repo name
  plugins: [react()],
});
