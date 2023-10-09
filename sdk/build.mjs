import * as esbuild from 'esbuild';

// Build for NodeJS
await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.node.js',
  external: ['node-fetch'],
});

// Build for Browser
await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'browser',
  outfile: 'dist/index.browser.js',
});

// buid for esm
await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/index.esm.js',
  external: ['node-fetch'],
});

console.log('Build completed');
