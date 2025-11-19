require('dotenv').config();
const { spawn } = require('child_process');
const fs = require('fs').promises;

const scriptsFolder = 'scripts';

const padScriptNumber = (scriptNumber, length = 3) => {
    return String(scriptNumber).padStart(length, '0');
};

const getScriptFileName = async scriptNumber => {
    try {
        const paddedScriptNumber = padScriptNumber(scriptNumber);
        const files = await fs.readdir(scriptsFolder);
        return files.find(file => file.startsWith(paddedScriptNumber));
    } catch (err) {
        console.error(err);
    }
};

const getSpaceId = () => {
    const { SPACE } = process.env;
    return SPACE;
};

const throwError = (message) => {
    throw new Error(message);
};

async function main() {
    const spaceId = getSpaceId();
    const contentfulToken = process.env.ACCESS_TOKEN;
    const environment = process.env.ENV;
    const migrationFile = await getScriptFileName(process.env.SCRIPT_NUMBER);

    if (!spaceId) {
        throwError(`Failed to retrieve spaceId`);
    }

    if (!migrationFile) {
        throwError(`Script not found, please specify a script number that exists within the 'scripts' folder`);
    }

    const command = `node_modules/.bin/ts-node node_modules/.bin/contentful-migration -s ${spaceId} -a ${contentfulToken} -e ${environment} ${scriptsFolder}/${migrationFile}`;

    const child = spawn(command, {
        shell: true,
        stdio: 'inherit',
        env: process.env,
    });

    child.on('close', (code) => {
        if (code !== 0) {
            console.error(`Migration process exited with code ${code}`);
        }
    });
}

main();
