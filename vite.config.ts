import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // This plugin generates the .d.ts files (TypeScript types)
    // so users get autocomplete when using your library.
    dts({ 
      include: ['src/lib'],
      outDir: 'dist'
    })
  ],
  build: {
    lib: {
      // The entry point (your "Front Door" file)
      entry: resolve(__dirname, 'src/lib/main.ts'),
      // The name of the global variable if used in a browser script tag
      name: 'GhShowcase',
      // The output filenames
      fileName: 'gh-showcase',
    },
    rollupOptions: {
      // "external" means: "Don't bundle React inside this package.
      // The user must provide their own React."
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    // Clear the output directory before building
    emptyOutDir: true,
    copyPublicDir: false,
  },
})
