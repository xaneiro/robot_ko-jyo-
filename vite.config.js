import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/robot_ko-jyo-/',
  plugins: [react()],
});
