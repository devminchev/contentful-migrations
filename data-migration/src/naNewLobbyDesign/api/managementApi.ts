import contentful, { Entry } from 'contentful-management';
let CONTENTFUL_CLIENT: contentful.ClientAPI;
let SPACE_CLIENT: contentful.Space;
let SPACE_ENVIRONMENT_CLIENT: contentful.Environment;
let SPACE_LOCAL: string;

export const apiSetup = async (accessToken: string, env: string, spaceId: string, spaceLocale: string) => {

    SPACE_LOCAL = spaceLocale;

    CONTENTFUL_CLIENT = contentful.createClient({ accessToken });
    SPACE_CLIENT = await CONTENTFUL_CLIENT.getSpace(spaceId);
    SPACE_ENVIRONMENT_CLIENT = await SPACE_CLIENT.getEnvironment(env);
};

export const getAll = async (type: string): Promise<Entry[]> => {
    let skip: number = 0;
    let totalFetched: number = 0;
    let totalEntries: number;
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

export const getEntries = async (type: string) => {
    return await getAll(type);
};

export const getEntriesByQuery = async (query: contentful.QueryOptions) => {
    const response = await SPACE_ENVIRONMENT_CLIENT.getEntries(query);

    return response;
};

export const getEntryById = async (entryId: string) => {
    const entry = await SPACE_ENVIRONMENT_CLIENT.getEntry(entryId);

    return entry;
};

export const updateAndPublishEntry = async (entry: contentful.Entry, fieldsPayload: any) => {    
    entry.fields = fieldsPayload;

    const updatedEntry = await entry.update();
    await updatedEntry.publish();
};

export const createAndPublishEntry = async (contentType: string, fieldsPayload: any) => {
    const newEntry = await SPACE_ENVIRONMENT_CLIENT.createEntry(contentType, {
        fields: fieldsPayload,
    });

    const entry = await newEntry.publish();

    return entry;
};
