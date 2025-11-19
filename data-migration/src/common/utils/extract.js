import contentfulExport from 'contentful-export';
import contentful from 'contentful-management';

export const extractToFile = (async (accessToken, env, spaceId, filePath, models) => {
    try {
        for (model of models) {
            console.log(`--------------------------------`)
            console.log(`Writing ${model} file...`);
            console.log(`--------------------------------`)

            await contentfulExport({
                spaceId,
                managementToken: accessToken,
                environmentId: env,
                contentFile: filePath,
                skipContentModel: true,
                queryAssets: [],
                queryEntries: [`content_type=${model}`],
                contentOnly: true,
                errorLogFile: filePath,
                useVerboseRenderer: true,
                maxAllowedLimit: 500,
                // rateLimit: 5
            });
        }
    } catch (e) {
        console.error(e)
    }
});

export const extractToArray = async (accessToken, spaceID, env, model, options) => {
    const client = await contentful.createClient({accessToken});
    const space = await client.getSpace(spaceID);
    const environment = await space.getEnvironment(env);

    return await environment.getEntries({
        limit: 1000,
        content_type: model,
        'sys.archivedAt[exists]': 'false',
        ...options
    });
};
