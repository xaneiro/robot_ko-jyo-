import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const deployTarget = process.env.VITE_DEPLOY_TARGET;
const base = deployTarget === 'github-pages' ? '/robot_ko-jyo-/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
});
