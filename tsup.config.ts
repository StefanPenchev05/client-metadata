import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  outDir: "dist",
  external: ["react"],
  target: "es2020",
  esbuildOptions(options) {
    // Add "use client" directive for React components
    options.banner = {
      js: '"use client";',
    };
  },
});
