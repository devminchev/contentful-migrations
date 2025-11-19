import { spawn } from 'node:child_process';
import { resolve as _resolve } from 'node:path';
import { promises as fs } from 'node:fs';

async function contentfulImport(old_model, spaceFolder, spaceLocale, env, space, new_model) {
  const contentFile = _resolve(
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

export { contentfulImport };
