import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

export const storeFile = async (entries: any[], path: string) => {
    console.log(`--------------------------------`)
    console.log(`Saving in ${path}`);
    console.log(`--------------------------------`)

    await writeFile(`${path}`, JSON.stringify({ entries }));
}

export const storeDXMapFile = async (sections = {}, views = {}, path) => {
    console.log(`--------------------------------`);
    console.log(`Saving in ${path}`);
    console.log(`--------------------------------`);

    let existingData = { sections: {}, views: {} };

    if (existsSync(path)) {
        try {
            const fileContent = await readFile(path, 'utf8');
            existingData = JSON.parse(fileContent);
        } catch (err) {
            console.error('Error reading existing file:', err);
        }
    }

    existingData.sections = { ...existingData.sections, ...sections };
    existingData.views = { ...existingData.views, ...views };

    try {
        await writeFile(path, JSON.stringify(existingData, null, 2));
        console.log('File updated successfully');
    } catch (err) {
        console.error('Error writing to file:', err);
    }
};