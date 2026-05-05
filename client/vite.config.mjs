import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true';
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')?.[1] || 'story-creator';

  return {
    base: isGitHubPagesBuild ? `/${repositoryName}/` : '/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  };
});