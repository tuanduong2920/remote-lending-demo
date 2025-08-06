import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      outDir: "dist/lib",
      include: ["src/index.ts", "src/**/*.vue"],
      exclude: ["src/**/*.spec.ts", "src/**/*.test.ts"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    host: "localhost",
    open: true,
  },
  build: {
    outDir: "dist/lib",
    // Inline CSS vào JS để tự động inject
    cssCodeSplit: false,
    lib: {
      // Entry point
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueWeatherApp",
      // Chỉ build ESM format
      formats: ["es"],
      fileName: () => "remote-entry.mjs",
    },
    rollupOptions: {
      output: {
        // Asset filename
        assetFileNames: "[name].[ext]",
        // Inline CSS vào JS
        inlineDynamicImports: true,
      },
      // Không generate CSS files riêng
      external: (id) => false,
    },
    // Target cho modern ESM
    target: "es2015",
    // Clean output directory
    emptyOutDir: true,
  },
  // CSS configuration
  css: {
    postcss: "./postcss.config.js",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": {},
  },
});
