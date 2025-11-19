import { spawn } from 'child_process';
import path from 'path';
const fs = require('fs').promises;

export const contentfulImport = async (old_model: string, spaceFolder: string, spaceLocale: string, env: string, space: string, new_model: string) => {
  const contentFile = path.resolve(
    __dirname,
    `./data/${old_model}/${spaceFolder}/${new_model}.json`
  );

  // Check if the file exists
  try {
    await fs.access(contentFile);
  } catch (error) {
    throw new Error(`The file ${contentFile} does not exist or is not accessible.`);
  }

  return new Promise((resolve, reject) => {
    const command = 'contentful';
    const args = [
      'space',
      'import',
      '--space-id',
      space,
      '--environment-id',
      env,
      '--content-file',
      contentFile
    ];

    const contentfulProcess = spawn(command, args);

    contentfulProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    contentfulProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    contentfulProcess.on('close', (code) => {
      if (code === 0) {
        resolve('Import completed successfully');
      } else {
        reject(new Error(`Import process exited with code ${code}`));
      }
    });

    contentfulProcess.on('error', (error) => {
      reject(error);
    });
  });
}
