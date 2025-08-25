#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const requiredVars = [
  'VITE_APP_ENV',
  'VITE_API_GATEWAY_URL',
  'VITE_LOGIN_API_URL',
  'VITE_API_VERSION',
  'VITE_SECRET_KEY',
  'VITE_LOGIN_APP_URL',
  'VITE_OFFER_APP_URL'
];

const optionalVars = [
  'VITE_DEV_SERVER_PORT',
  'VITE_PREVIEW_SERVER_PORT',
  'VITE_TEST_LOGIN_APP_URL',
  'VITE_TEST_API_BASE_URL',
  'VITE_TEST_APP_ENV'
];

function validateEnvironment(env) {
  const envFile = path.join(__dirname, '..', `.env.${env}`);
  
  if (!fs.existsSync(envFile)) {
    console.error(`❌ Environment file not found: .env.${env}`);
    return false;
  }
  
  const envContent = fs.readFileSync(envFile, 'utf8');
  const envVars = {};
  
  // Parse environment variables
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key] = valueParts.join('=');
      }
    }
  });
  
  console.log(`\n🔍 Validating .env.${env}...`);
  
  let isValid = true;
  const missing = [];
  const empty = [];
  
  // Check required variables
  requiredVars.forEach(varName => {
    if (!envVars.hasOwnProperty(varName)) {
      missing.push(varName);
      isValid = false;
    } else if (!envVars[varName] || envVars[varName].trim() === '') {
      empty.push(varName);
      isValid = false;
    }
  });
  
  // Report issues
  if (missing.length > 0) {
    console.error(`❌ Missing required variables: ${missing.join(', ')}`);
  }
  
  if (empty.length > 0) {
    console.error(`❌ Empty required variables: ${empty.join(', ')}`);
  }
  
  // Check optional variables
  const optionalMissing = optionalVars.filter(varName => !envVars.hasOwnProperty(varName));
  if (optionalMissing.length > 0) {
    console.warn(`⚠️  Missing optional variables: ${optionalMissing.join(', ')}`);
  }
  
  // Validate URLs
  const urlVars = ['VITE_API_GATEWAY_URL', 'VITE_LOGIN_API_URL', 'VITE_LOGIN_APP_URL', 'VITE_OFFER_APP_URL'];
  urlVars.forEach(varName => {
    if (envVars[varName]) {
      try {
        new URL(envVars[varName]);
      } catch (error) {
        console.error(`❌ Invalid URL in ${varName}: ${envVars[varName]}`);
        isValid = false;
      }
    }
  });
  
  // Validate ports
  const portVars = ['VITE_DEV_SERVER_PORT', 'VITE_PREVIEW_SERVER_PORT'];
  portVars.forEach(varName => {
    if (envVars[varName]) {
      const port = parseInt(envVars[varName]);
      if (isNaN(port) || port < 1 || port > 65535) {
        console.error(`❌ Invalid port in ${varName}: ${envVars[varName]}`);
        isValid = false;
      }
    }
  });
  
  if (isValid) {
    console.log(`✅ .env.${env} is valid`);
  } else {
    console.log(`❌ .env.${env} has issues`);
  }
  
  return isValid;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔍 Validating all environment files...\n');
    const environments = ['development', 'qa', 'uat', 'production'];
    let validCount = 0;
    
    environments.forEach(env => {
      if (validateEnvironment(env)) {
        validCount++;
      }
    });
    
    console.log(`\n📋 Summary: ${validCount}/${environments.length} environment files are valid`);
    
  } else if (args.length === 1) {
    const env = args[0];
    const environments = ['development', 'qa', 'uat', 'production'];
    
    if (environments.includes(env)) {
      validateEnvironment(env);
    } else {
      console.error(`❌ Invalid environment: ${env}`);
      console.log(`Available environments: ${environments.join(', ')}`);
    }
  } else {
    console.log('Usage:');
    console.log('  node scripts/validate-env.js          # Validate all environments');
    console.log('  node scripts/validate-env.js <env>    # Validate specific environment');
    console.log('  Available environments: development, qa, uat, production');
  }
}

main(); 