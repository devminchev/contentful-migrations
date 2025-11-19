
import contentfulExport from 'contentful-export';

import { CONTENT_TYPES } from '../constants.js';

import { promises as fs } from 'node:fs';
import { join } from 'node:path';

async function createDirectoryIfNotExists(name, spaceFolder) {
    const dirPath = join('./src/euNewLobbyDesign/data', name, spaceFolder);

    try {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`Directory created (if not exists): ${dirPath}`);
    } catch (error) {
        console.error(`Error creating directory: ${error.message}`);
    }
}


const script = (async (accessToken, env, spaceId, spaceFolder) => {
    try {
        for (const contentType of CONTENT_TYPES) {
            const { model, query, name } = contentType;
            await createDirectoryIfNotExists(name, spaceFolder);
            const queryEntries = [`content_type=${model}`, ...query]
            console.log(`--------------------------------`)
            console.log(`Writing ${model} file...`);
            console.log(`--------------------------------`)

            await contentfulExport({
                spaceId,
                managementToken: accessToken,
                environmentId: env,
                contentFile: `./src/euRegulatoryMinMaxBetRemovalGameSiteGame/data/${name}/${spaceFolder}/${name}.json`,
                skipContentModel: true,
                queryAssets: [],
                queryEntries,
                contentOnly: true,
                errorLogFile: `./src/euRegulatoryMinMaxBetRemovalGameSiteGame/data/${name}/${spaceFolder}/${name}-error.log`,
                useVerboseRenderer: true,
                maxAllowedLimit: 500,
                limit: 5
            });
        }
    } catch (e) {
        console.error(e)
    }
});


export default script;
