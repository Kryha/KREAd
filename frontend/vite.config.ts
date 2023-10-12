import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { resolve } from "path"; // Import the 'resolve' function

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["@endo/init"],
    esbuildOptions: { target: "es2020", supported: { bigint: true } },
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
      jsxRuntime: "classic",
    }),
    tsconfigPaths(),
    svgr(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"), // Specify the path to your index.html file
      },
    },
    target: "es2020",
  },
});

