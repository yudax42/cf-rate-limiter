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
  globalName: 'RateLimiterSDK',
  define: { 'process.env.NODE_ENV': '"production"' },
});

console.log('Build completed');
