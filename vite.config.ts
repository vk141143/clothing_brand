import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackStartVitePlugin } from "@tanstack/react-start/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    TanStackStartVitePlugin(),
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  ssr: {
    noExternal: [
      "@radix-ui/**",
      "framer-motion",
      "sonner",
      "embla-carousel-react",
    ],
  },
});
