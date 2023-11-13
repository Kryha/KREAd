import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

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
    target: "es2020",
  },
});
