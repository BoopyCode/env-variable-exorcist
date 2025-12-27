#!/usr/bin/env node

// Environment Variable Exorcist - Banishes missing vars to the shadow realm
// Usage: node env-exorcist.js <env-file> <reference-file>

const fs = require('fs');
const path = require('path');

// The ritual begins
function performExorcism(envPath, referencePath) {
    console.log(`🔮 Summoning variables from ${envPath}...`);
    
    try {
        // Read the sacred texts (env files)
        const envContent = fs.readFileSync(envPath, 'utf8');
        const referenceContent = fs.readFileSync(referencePath, 'utf8');
        
        // Extract variable names (the souls we need to check)
        const envVars = extractVars(envContent);
        const referenceVars = extractVars(referenceContent);
        
        console.log(`📜 Found ${envVars.size} variables in ${path.basename(envPath)}`);
        console.log(`📚 Found ${referenceVars.size} variables in ${path.basename(referencePath)}`);
        
        // The moment of truth: which variables are missing?
        const missingVars = [...referenceVars].filter(varName => !envVars.has(varName));
        const extraVars = [...envVars].filter(varName => !referenceVars.has(varName));
        
        // Deliver the verdict
        if (missingVars.length === 0 && extraVars.length === 0) {
            console.log('✅ All variables accounted for! No demons found.');
            return 0;
        }
        
        if (missingVars.length > 0) {
            console.log('👻 MISSING VARIABLES (probably haunting your production):');
            missingVars.forEach(varName => console.log(`   - ${varName}`));
        }
        
        if (extraVars.length > 0) {
            console.log('🧟 EXTRA VARIABLES (zombies from old configs):');
            extraVars.forEach(varName => console.log(`   - ${varName}`));
        }
        
        console.log(`\n💀 Exorcism complete. Found ${missingVars.length + extraVars.length} issues.`);
        return 1;
        
    } catch (error) {
        console.error(`❌ Ritual failed: ${error.message}`);
        console.error('Did you sacrifice the correct file paths?');
        return 2;
    }
}

// Extract variable names from env file content
function extractVars(content) {
    const vars = new Set();
    const lines = content.split('\n');
    
    lines.forEach(line => {
        const trimmed = line.trim();
        // Skip comments and empty lines
        if (trimmed && !trimmed.startsWith('#')) {
            const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=/);
            if (match) {
                vars.add(match[1]);
            }
        }
    });
    
    return vars;
}

// Main invocation - check if we have the right ingredients
if (process.argv.length !== 4) {
    console.log('Usage: node env-exorcist.js <your-env-file> <reference-env-file>');
    console.log('Example: node env-exorcist.js .env .env.example');
    console.log('\nPro tip: Add this to your package.json scripts for maximum ghostbusting!');
    process.exit(1);
}

const exitCode = performExorcism(process.argv[2], process.argv[3]);
process.exit(exitCode);
