
// @ts-ignore
import contentfulExport from 'contentful-export';
import { CONTENT_TYPES } from '../constant.js';

const script = (async (accessToken, env, spaceId, spaceFolder) => {
    for (let contentType of CONTENT_TYPES) {
        try {
            console.log(`--------------------------------`)
            console.log(`Writing ${contentType} file...`);
            console.log(`--------------------------------`)

            await contentfulExport({
                spaceId,
                managementToken: accessToken,
                environmentId: env,
                contentFile: `./src/layoutMigrationV2/data/${spaceFolder}/${contentType}.json`,
                skipContentModel: true, // do not import the content model structure
                queryAssets: [], // do not import any assets
                queryEntries: [
                    `content_type=${contentType}`
                ],
                contentOnly: true,
                errorLogFile: `./src/layoutMigrationV2/data/${spaceFolder}/${contentType}-error.log`,
                useVerboseRenderer: true,
                maxAllowedLimit: 500,
                rateLimit: 5
            });
        } catch (e) {
            console.error(e)
        }
    }
})

export default script;
