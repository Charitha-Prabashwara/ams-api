#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const esbuildConfig = require('./esbuild.config');


const OUT_DIR = path.resolve(__dirname, 'build');
const DIST_FILE = path.resolve(__dirname, esbuildConfig.outfile);
const VERSION = require('./package.json').version || '1.0.0';
const NAME = require('./package.json').name


if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// -------------------------------
// 1️⃣ Bundle with esbuild using config
// -------------------------------
console.log('Bundling with esbuild...');
esbuild.buildSync(esbuildConfig);
console.log('esbuild bundling completed.');


const targets = [
  { name: 'Windows', target: 'node18-win-x64', file: `${NAME}-v${VERSION}-win-x64.exe` },
  { name: 'Linux', target: 'node18-linux-x64', file: `${NAME}-v${VERSION}-linux-x64` },
  { name: 'macOS', target: 'node18-macos-x64', file: `${NAME}-v${VERSION}-macos-x64` },
];


const hostOS = process.platform;

console.log('Building cross-platform binaries with pkg...');

targets.forEach(({ name, target, file }) => {

  if (name === 'macOS' && hostOS !== 'darwin') {
    console.log(`Skipping macOS build (must run on macOS)`);
    return;
  }

  console.log(`Building ${name}...`);
  try {
    const isWin = process.platform === 'win32';
    const pkgPath = isWin ? 'node_modules/.bin/pkg.cmd' : 'node_modules/.bin/pkg';
    
    execSync(`"${pkgPath}" "${DIST_FILE}" --targets ${target} --output "${path.join(OUT_DIR, file)}"`, { stdio: 'inherit' });
    if (hostOS == 'Linux') {
      execSync(`chmod +x "${path.join(OUT_DIR, file)}"`);
    }
  } catch (err) {
    console.error(`Failed to build ${name}:`, err.message);
  }
});

console.log('Build completed.');
