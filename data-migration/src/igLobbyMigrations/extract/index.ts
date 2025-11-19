
import contentfulExport from 'contentful-export';
import { CONTENT_TYPES } from '../constants';

import { promises as fs } from 'node:fs';
import * as path from 'node:path';

export async function createDirectoryIfNotExists(name: string, spaceFolder: string) {
    const dirPath = path.join('./src/igLobbyMigrations/data', name, spaceFolder);

    try {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`Directory created (if not exists): ${dirPath}`);
    } catch (error) {
        console.error(`Error creating directory: ${error.message}`);
    }
}

export const createFile = async (name: string) => {
    try {
        await fs.access(name, fs.constants.R_OK | fs.constants.W_OK);
    } catch {
        fs.writeFile(name, '');
        console.error('cannot access');
    }
};

interface ContentType {
    model: string;
    query: string[];
    name: string;
}

export const executeContentfulExport = async (contentType: ContentType, spaceFolder: string, spaceId: string, accessToken: string, env: string) => {
    const { model, query, name } = contentType;
    await createDirectoryIfNotExists(name, spaceFolder);
    const queryEntries = [`content_type=${model}`, ...query]

    await contentfulExport({
        spaceId,
        managementToken: accessToken,
        environmentId: env,
        contentFile: `./src/igLobbyMigrations/data/${name}/${spaceFolder}/${name}.json`,
        skipContentModel: true,
        queryAssets: [],
        queryEntries,
        contentOnly: true,
        errorLogFile: `./src/igLobbyMigrations/data/${name}/${spaceFolder}/${name}-error.log`,
        useVerboseRenderer: true,
        maxAllowedLimit: 500,
        limit: 5
    });
};

export const script = (async (accessToken: string, env: string, spaceId: string, spaceFolder: string) => {
    try {
        for (let contentType of CONTENT_TYPES) {
            console.log(`--------------------------------`)
            console.log(`Writing ${contentType.model} file...`);
            console.log(`--------------------------------`)
            await executeContentfulExport(
                contentType, spaceFolder, spaceId, accessToken, env
            );
            console.log(`--------------------------------`);
            console.log(`Finished writing ${contentType.model} file`);
            console.log(`--------------------------------`); 
        }       
    } catch (e) {
        console.error(e)
    }
});

