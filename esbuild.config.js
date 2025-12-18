const esbuild = require('esbuild');

const externals = [
  '@faker-js/faker',
  'swagger-ui-express',
  'swagger-jsdoc',
  'bcrypt',
  'mongodb',
  'mongoose',
  'ioredis',
  'jsonwebtoken',
  'fs',
  'path',
  'os',
  'crypto',
  'uuid'
];

module.exports = {
  entryPoints: ['src/server.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/app.js',        // <-- this must exist
  minify: true,
  treeShaking: true,
  legalComments: 'none',
  sourcemap: false,
  external: externals,
  logLevel: 'info',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
};