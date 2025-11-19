require('dotenv').config();
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const acceptedArgs = ['script'];

const parseArgs = (args, acceptedArgs) => args.reduce((acc, arg) => {
    const [key, value] = arg.split('=');
    if (acceptedArgs.includes(key)) {
        acc[key] = value;
    }
    return acc;
}, {});

const throwError = (message) => {
    console.error(`❌ ${message}`);
    process.exit(1);
};

const parsedArgs = parseArgs(args, acceptedArgs);
const scriptInput = parsedArgs.script || process.env.SCRIPT_NUMBER;

if (!scriptInput) {
    throwError(`No script number provided. Use 'script=001' or 'script=164...172' in your .env file.`);
}

// Check if input is a range (e.g., "164...172")
const match = scriptInput.match(/^(\d+)\.\.\.(\d+)$/);
let scriptNumbers = [];

if (match) {
    const startScript = parseInt(match[1], 10);
    const endScript = parseInt(match[2], 10);

    if (isNaN(startScript) || isNaN(endScript) || startScript > endScript) {
        throwError(`Invalid script range. Ensure it's in 'XXX...YYY' format and start <= end.`);
    }

    scriptNumbers = Array.from({ length: endScript - startScript + 1 }, (_, i) => startScript + i);
    console.log(`🚀 Running migrations from ${startScript} to ${endScript}...\n`);
} else {
    // If not a range, assume it's a single script number
    const singleScript = parseInt(scriptInput, 10);
    if (isNaN(singleScript)) {
        throwError(`Invalid script number. Use 'XXX' or 'XXX...YYY' format.`);
    }

    scriptNumbers = [singleScript]; // ✅ Run just this one
    console.log(`🚀 Running single migration: ${singleScript}...\n`);
}

// Store failed migrations
const failedMigrations = [];

// Function to run a migration and wait for completion
const runMigration = (scriptNumber) => {
    return new Promise((resolve) => {
        console.log(`🔄 Running migration: ${scriptNumber}...`);

        const child = spawn('node', ['run-migration.js'], {
            stdio: 'inherit',
            env: {
                ...process.env,
                SCRIPT_NUMBER: scriptNumber
            }
        });

        child.on('exit', (code) => {
            if (code === 0) {
                console.log(`✅ Migration ${scriptNumber} completed successfully.\n`);
                resolve();
            } else {
                console.error(`❌ Migration ${scriptNumber} failed with exit code ${code}`);
                failedMigrations.push(scriptNumber); // ✅ Store the failed migration
                resolve(); // ✅ Continue to next migration instead of stopping
            }
        });

        child.on('error', (err) => {
            console.error(`❌ Error running migration ${scriptNumber}: ${err.message}`);
            failedMigrations.push(scriptNumber); // ✅ Store the failed migration
            resolve(); // ✅ Continue execution
        });
    });
};

// Run migrations in sequence
const runAllMigrations = async () => {
    for (const scriptNumber of scriptNumbers) {
        await runMigration(scriptNumber);
    }

    console.log(`🎉 All migrations completed!`);

    if (failedMigrations.length > 0) {
        console.error(`⚠️ Some migrations failed: ${failedMigrations.join(", ")}`);
        process.exit(1); // Exit with failure code if there were failed migrations
    } else {
        console.log(`✅ All migrations ran successfully!`);
    }
};

runAllMigrations();
