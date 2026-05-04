import { defineConfig, normalizePath, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

function jsxInJs() {
  return {
    name: 'jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
      const normalizedId = normalizePath(id);
      if (!normalizedId.includes('/src/') || !normalizedId.endsWith('.js')) {
        return null;
      }

      const result = await transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic',
      });

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}

export default defineConfig({
  plugins: [jsxInJs(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});