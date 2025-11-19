import contentful from 'contentful-management';
import { readFile } from 'node:fs/promises';
import { writeFileSync, writeFile } from 'node:fs';

export default async (new_model: string, spaceFolder: string, spaceLocale: string | number, targetEnv: string, targetSpace: string, old_model: any, accessToken: string) => {
    try {
        const client = contentful.createClient({ accessToken });
        const space = await client.getSpace(targetSpace);
        const environment = await space.getEnvironment(targetEnv);

        const data = JSON.parse(await readFile(`./src/euNewLobbyDesign/data/${old_model}/${spaceFolder}/${new_model}.json`, 'utf-8'));
        const dataEntries = [...data.entries]
        console.log('Total Data Entries : ', dataEntries.length);

        const transformedModel = [];
        const failedEntries = [];
        let iterator = 0;
        const startTime = Date.now();

        for (let i = 0; i < dataEntries.length; i++) {
            const dataEntry = dataEntries[i];
            const dataFields = dataEntry.fields;
            console.log(`${new_model} Iterator : `, iterator);

            let entry = await environment.createEntry(new_model, {
                fields: { ...dataFields }
            });

            try {
                entry = await entry.publish();
                transformedModel.push(entry);

                logProgressInfo(dataFields.entryTitle[spaceLocale], iterator, dataEntries.length, startTime);

                // Remove the game from the file
                const index = data.entries.findIndex((/** @type {{ fields: { entryTitle: any; }; }} */ entry) => entry.fields.entryTitle === dataEntry.fields.entryTitle);
                data.entries.splice(index, 1);
                await writeFile(`./src/euNewLobbyDesign/data/${old_model}/${spaceFolder}/${new_model}.json`, JSON.stringify(data), err => { });
            } catch (err) {
                failedEntries.push({
                    title: dataFields.entryTitle[spaceLocale],
                    error: err
                });
                console.error(`Failed to publish ${dataFields.entryTitle[spaceLocale]}`)
                // Add game to failed published entires file
                await writeFile(`./src/euNewLobbyDesign/data/${old_model}/${spaceFolder}/${new_model}-failed.json`, JSON.stringify(failedEntries), err => { });
            }
            iterator++;
        }

        await writeFileSync(`./src/euNewLobbyDesign/data/${old_model}/${spaceFolder}/${new_model}-transformed.json`,
            JSON.stringify({
                entries: transformedModel
            }));
    } catch (err) {
        console.error(err);
    }
};

const logProgressInfo = async (/** @type {any} */ entryTitle, /** @type {number} */ iterator, /** @type {number} */ totalData, /** @type {number} */ startTime) => {
    const currentTime = Date.now();
    const totalTime = currentTime - startTime;
    const progress = ((iterator + 1) / totalData) * 100;
    console.log(`----- Progress of Published : ${entryTitle} Percentage: ${progress.toFixed(2)}% -----`);
    console.log(`----- Progress of Published : ${entryTitle} Total Time Taken: ${Math.floor(totalTime / 60000)}m ${Math.floor((totalTime % 60000) / 1000)}s -----`);
};
