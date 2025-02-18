import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig((configEnv) => {
  const isReport = configEnv.mode === 'report';

  const plugins = [];

  plugins.push(react());
  plugins.push(tailwindcss() as any);
  plugins.push(splitVendorChunkPlugin());
  plugins.push(viteCompression({ verbose: true, algorithm: 'brotliCompress' }));

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  isReport &&
    plugins.push(
      visualizer({
        filename: './dist/report.html',
        open: true,
        brotliSize: true
      })
    );

  return {
    plugins,
    resolve: {
      alias: {
        components: resolve(__dirname, 'src', 'components'),
        services: resolve(__dirname, 'src', 'services'),
        styles: resolve(__dirname, 'src', 'styles'),
        hooks: resolve(__dirname, 'src', 'hooks'),
        utils: resolve(__dirname, 'src', 'utils')
      }
    },
    css: {
      modules: {
        generateScopedName: '[hash:base64:5]'
      }
    }
  };
});
