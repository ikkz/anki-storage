import { resolve } from 'path'
import { defineConfig } from 'vite'
import packageJson from './package.json';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib.ts'),
      name: 'AnkiStorage',
      fileName: (format) => `${packageJson.name}.${format === 'umd' ? 'umd.js' : 'js'}`,
    },
    outDir: 'dist',
  }
})