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

esbuild.build({
  entryPoints: ['src/server.js'],
  bundle: true,
  platform: 'node',
  target: 'node18', 
  outfile: 'build/app.js',
  minify: true,
  treeShaking: true,
  legalComments: 'none',
  sourcemap: false,
  external: externals,
  logLevel: 'info',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).catch(() => process.exit(1));
