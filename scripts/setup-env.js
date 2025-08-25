#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const environments = ['development', 'qa', 'uat', 'production'];

function setupEnvironment(env) {
  const exampleFile = path.join(__dirname, '..', `env.${env}.example`);
  const targetFile = path.join(__dirname, '..', `.env.${env}`);
  
  if (!fs.existsSync(exampleFile)) {
    console.error(`❌ Example file not found: ${exampleFile}`);
    return false;
  }
  
  if (fs.existsSync(targetFile)) {
    console.log(`⚠️  Environment file already exists: .env.${env}`);
    return false;
  }
  
  try {
    fs.copyFileSync(exampleFile, targetFile);
    console.log(`✅ Created .env.${env} from example`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create .env.${env}:`, error.message);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🚀 Setting up all environment files...\n');
    let created = 0;
    
    environments.forEach(env => {
      if (setupEnvironment(env)) {
        created++;
      }
    });
    
    console.log(`\n📋 Summary: Created ${created} environment file(s)`);
    console.log('\n📝 Next steps:');
    console.log('1. Edit the .env files with your environment-specific values');
    console.log('2. Run "npm run dev" for development');
    console.log('3. Run "npm run dev:qa" for QA environment');
    console.log('4. Run "npm run dev:uat" for UAT environment');
    console.log('5. Run "npm run dev:prod" for production environment');
    
  } else if (args.length === 1) {
    const env = args[0];
    if (environments.includes(env)) {
      setupEnvironment(env);
    } else {
      console.error(`❌ Invalid environment: ${env}`);
      console.log(`Available environments: ${environments.join(', ')}`);
    }
  } else {
    console.log('Usage:');
    console.log('  node scripts/setup-env.js          # Setup all environments');
    console.log('  node scripts/setup-env.js <env>    # Setup specific environment');
    console.log(`  Available environments: ${environments.join(', ')}`);
  }
}

main(); 