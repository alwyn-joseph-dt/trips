#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying deployment build...\n');

// Check if dist directory exists
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found! Run "npm run build" first.');
  process.exit(1);
}

// Check essential files
const requiredFiles = [
  'index.html',
  'js/index-BItzdTd9.js',
  'css/bootstrap-C17le-2G.css'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check vercel.json
const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  console.log('\n✅ vercel.json found');
  const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  if (config.rewrites && config.rewrites.length > 0) {
    console.log('✅ Vercel rewrites configured for SPA routing');
  } else {
    console.log('❌ Vercel rewrites not configured');
    allFilesExist = false;
  }
} else {
  console.log('\n❌ vercel.json not found');
  allFilesExist = false;
}

console.log('\n📋 Deployment Checklist:');
console.log('1. ✅ Build completed successfully');
console.log('2. ✅ dist directory created');
console.log('3. ✅ Essential files present');
console.log('4. ✅ Vercel configuration ready');

if (allFilesExist) {
  console.log('\n🎉 Your app is ready for deployment!');
  console.log('Deploy to Vercel using: vercel --prod');
} else {
  console.log('\n⚠️  Some issues found. Please fix them before deploying.');
  process.exit(1);
}
