<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [react()],
})
=======
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/raconteur-web/", // Set to your repo name for GitHub Pages
  plugins: [react()],
});
>>>>>>> origin/main
