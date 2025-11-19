
import { CONTENT_TYPES } from '../constants.js';
import contentfulExport from 'contentful-export';

const script = (async (accessToken, env, spaceId, spaceFolder) => {
    try {
        for (contentType of CONTENT_TYPES) {
            const { model, query, name } = contentType;
            const queryEntries = [`content_type=${model}`, ...query]
            console.log(`--------------------------------`)
            console.log(`Writing ${model} file...`);
            console.log(`--------------------------------`)

            await contentfulExport({
                spaceId,
                managementToken: accessToken,
                environmentId: env,
                contentFile: `./src/gameModelV2/data/gamev1/${spaceFolder}/${name}.json`,
                skipContentModel: true,
                queryAssets: [],
                queryEntries,
                contentOnly: true,
                errorLogFile: `./src/gameModelV2/data/gamev1/${spaceFolder}/${name}-error.log`,
                useVerboseRenderer: true,
                maxAllowedLimit: 500,
                rateLimit: 5
            });
        }
    } catch (e) {
        console.error(e)
    }
});


export default script;
