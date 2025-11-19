import { createClient } from 'contentful-management';
import { readFile } from 'fs/promises';
import { writeFileSync, writeFile } from 'fs';
// const SITEGAMEV2_TYPE = 'siteGameV2';
// const GAMEV2_TYPE = 'gameV2';

export default async (model, spaceFolder, spaceLocale, targetEnv, targetSpace) => {
    try {
        const client = createClient({ accessToken: 'CFPAT-AtDBQJeUUvDXjJam8sNK2Me1SEHdtlBczPL061XSHyM' });
        const space = await client.getSpace(targetSpace);
        const environment = await space.getEnvironment(targetEnv);

        const data = JSON.parse(await readFile(`./src/gameModelV2/data/gamev2/${spaceFolder}/${model}.json`, 'utf-8'));
        const dataEntries = [...data.entries]
        console.log('Total Data Entries : ', dataEntries.length);

        const transformedModel = [];
        const failedEntries = [];
        let iterator = 0;
        const startTime = Date.now();

        for (let i = 0; i < dataEntries.length; i++) {
            const dataEntry = dataEntries[i];
            const dataFields = dataEntry.fields;
            console.log(`${model} Iterator : `, iterator);

            let entry = await environment.createEntry(model, {
                fields: { ...dataFields }
            });

            try {
                entry = await entry.publish();
                transformedModel.push(entry);

                logProgressInfo(dataFields.entryTitle[spaceLocale], iterator, dataEntries.length, startTime);

                // Remove the game from the file
                const index = data.entries.findIndex(entry => entry.fields.entryTitle === dataEntry.fields.entryTitle);
                data.entries.splice(index, 1);
                await writeFile(`./src/gameModelV2/data/gamev2/${spaceFolder}/${model}.json`, JSON.stringify(data), err => { });
            } catch (err) {
                failedEntries.push({
                    title: dataFields.entryTitle[spaceLocale],
                    error: err
                });
                console.error(`Failed to publish ${dataFields.entryTitle[spaceLocale]}`)
                // Add game to failed published entires file
                await writeFile(`./src/gameModelV2/data/gamev2/${spaceFolder}/${model}-failed.json`, JSON.stringify(failedEntries), err => { });
            }
            iterator++;
        }

        await writeFileSync(`./src/gameModelV2/data/gamev2/${spaceFolder}/${model}-transformed.json`,
            JSON.stringify({
                entries: transformedModel
            }));
    } catch (err) {
        console.error(err);
    }
};

const logProgressInfo = async (entryTitle, iterator, totalData, startTime) => {
    const currentTime = Date.now();
    const totalTime = currentTime - startTime;
    const progress = ((iterator + 1) / totalData) * 100;
    console.log(`----- Progress of Published : ${entryTitle} Percentage: ${progress.toFixed(2)}% -----`);
    console.log(`----- Progress of Published : ${entryTitle} Total Time Taken: ${Math.floor(totalTime / 60000)}m ${Math.floor((totalTime % 60000) / 1000)}s -----`);
};
