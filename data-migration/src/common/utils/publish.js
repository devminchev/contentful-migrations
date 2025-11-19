import { readFile } from 'node:fs/promises';
import { writeFile } from 'node:fs';

export const publishFile = async (accessToken, spaceID, env, filePath) => {
    try {
        const client = contentful.createClient({ accessToken });
        const space = await client.getSpace(spaceID);
        const environment = await space.getEnvironment(env);

        const data = JSON.parse(await readFile(filePath, 'utf-8'));
        const dataCopy = [...data.entries];
        const publishedData = [];

        for (dataEntry of dataCopy) {
            const dataFields = dataEntry.fields;
            let entry = await environment.createEntry(model, {
                fields: {
                    ...dataFields
                },
            });
            entry = await entry.publish();

            console.log(`Published: ${dataFields.entryTitle}`);

            publishedData.push(entry);

            const index = data.entries.findIndex(entry => entry.fields.entryTitle === dataEntry.fields.entryTitle);
            data.entries.splice(index, 1);

            await writeFile(filePath, JSON.stringify(data), err => { console.error(err) });
        }

        await writeFile(`${filePath}-transformed.json`,JSON.stringify({entries: transformedModel}), err => { console.error(err)});
    } catch (err) {
        console.error(err);
    }
};
