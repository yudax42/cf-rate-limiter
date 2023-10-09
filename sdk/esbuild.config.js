import { build } from 'esbuild';

const nodeConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/node/index.js',
};

const browserConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'browser',
  outfile: 'dist/browser/index.js',
};

// Export configurations
export default {
  nodeConfig,
  browserConfig,
  buildForNode: () => build(nodeConfig),
  buildForBrowser: () => build(browserConfig),
};
