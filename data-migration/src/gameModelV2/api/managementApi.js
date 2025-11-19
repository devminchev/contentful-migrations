import  * as contentful  from 'contentful-management';
const { createClient } = contentful['default'];
let CONTENTFUL_CLIENT;
let SPACE_CLIENT;
let SPACE_ENVIRONMENT_CLIENT;
let SPACE_LOCAL;

async function apiSetup(accessToken, env, spaceId, spaceLocale) {
    SPACE_LOCAL = spaceLocale;

    CONTENTFUL_CLIENT = createClient({ accessToken });
    SPACE_CLIENT = await CONTENTFUL_CLIENT.getSpace(spaceId);
    SPACE_ENVIRONMENT_CLIENT = await SPACE_CLIENT.getEnvironment(env);
};

async function getAll(type) {
    let skip = 0;
    let totalFetched = 0;
    let totalEntries;
    const allEntries = [];

    const initialResponse = await SPACE_ENVIRONMENT_CLIENT.getEntries({
        limit: 1,
        content_type: type
    });
    totalEntries = initialResponse.total;

    while (totalFetched < totalEntries) {
        const response = await SPACE_ENVIRONMENT_CLIENT.getEntries({
            skip: skip,
            limit: 100,
            include: 2,
            content_type: type
        });

        allEntries.push(...response.items);
        totalFetched += response.items.length;
        skip += response.items.length;

        console.log('LOADING DATA ...', skip);
    }

    return allEntries;
};

async function getEntries(type) {
    return await getAll(type);
};

async function getEntriesByQuery(query) {
    const response = await SPACE_ENVIRONMENT_CLIENT.getEntries(query);

    return response;
};

async function getEntryById(entryId) {
    const entry = await SPACE_ENVIRONMENT_CLIENT.getEntry(entryId);

    return entry;
};

async function updateAndPublishEntry(entry, fieldsPayload) {
    entry.fields = fieldsPayload;

    const updatedEntry = await entry.update();
    await updatedEntry.publish();
};

async function createAndPublishEntry(contentType, fieldsPayload) {
    const newEntry = await SPACE_ENVIRONMENT_CLIENT.createEntry(contentType, {
        fields: fieldsPayload,
    });

    const entry = await newEntry.publish();

    return entry;
};

export {
    apiSetup,
    getEntryById,
    getEntries,
    updateAndPublishEntry,
    createAndPublishEntry
}
