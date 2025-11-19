import contentful from 'contentful-management';
import { readFile } from 'node:fs/promises';
import { writeFileSync, writeFile } from 'node:fs';

export const publishData = async (
    new_model: string,
    spaceFolder: string,
    spaceLocale: string,
    targetEnv: string,
    targetSpace: string,
    old_model: string,
    accessToken: string,
    extraParams: any = {} // Object to optionally override file paths
) => {
    try {
        const client = contentful.createClient({ accessToken });
        const space = await client.getSpace(targetSpace);
        const environment = await space.getEnvironment(targetEnv);

        // Set default file paths based on passed parameters
        const defaultOutputFiles = {
            data: `./src/igLobbyMigrations/data/${old_model}/${spaceFolder}/${new_model}.json`,
            failed: `./src/igLobbyMigrations/data/${old_model}/${spaceFolder}/${old_model}-failed.json`,
            transformed: `./src/igLobbyMigrations/data/${old_model}/${spaceFolder}/${old_model}-transformed.json`
        };

        // Grab any additional parameters if they are passed
        const { outputFiles = {}, whitehatGameMigration = false, includeWhitehatDrafts = false } = extraParams;
        
        // Merge defaults with any provided overrides
        const { data: dataFile, failed: failedFile, transformed: transformedFile } = {
            ...defaultOutputFiles,
            ...outputFiles
        };

        // For Whitehat siteGame migrations
        let prevSuccessfullyMigratedGames = whitehatGameMigration && checkIfPreviousMigrations() || [];

        // Read the input data file
        const data = JSON.parse(await readFile(dataFile, 'utf-8'));
        const dataEntries = [...data.entries];
        console.log('Total Data Entries : ', dataEntries.length);

        const transformedModel = [];
        const failedEntries = [];
        let iterator = 0;
        const startTime = Date.now();

        for (let i = 0; i < dataEntries.length; i++) {
            const dataEntry = dataEntries[i];
            const dataFields = dataEntry.fields;
            const uniqueSiteGameId = dataEntry?.metadata?.tags?.[0];
            // this is for whitehat so we can add draft entries
            const isDraft = includeWhitehatDrafts && (dataEntry?.metadata?.publishedStatus === 'draft');
            
            console.log(`${new_model} Iterator : `, iterator);

            let entry = await environment.createEntry(new_model, {
                fields: { ...dataFields }
            });

            try {
                if (!isDraft) {
                    entry = await entry.publish();
                }
                
                transformedModel.push(entry);

                logProgressInfo(dataFields.entryTitle[spaceLocale], iterator, dataEntries.length, startTime);

                // For Whitehat siteGame migrations
                whitehatGameMigration && prevSuccessfullyMigratedGames.push(uniqueSiteGameId);

                // Remove the entry from the original data and update the file
                const index = data.entries.findIndex(
                    entry => entry.fields.entryTitle === dataEntry.fields.entryTitle
                );
                data.entries.splice(index, 1);
                await writeFile(dataFile, JSON.stringify(data), err => { });
            } catch (err) {
                failedEntries.push({
                    title: dataFields.entryTitle[spaceLocale],
                    error: err
                });
                console.error(`Failed to publish ${dataFields.entryTitle[spaceLocale]}`);
                // Update the failed entries file
                await writeFile(failedFile, JSON.stringify(failedEntries), err => { });
            }
            iterator++;
        }

        // For Whitehat siteGame migrations
        whitehatGameMigration && storeSuccessfulMigration(prevSuccessfullyMigratedGames);

        // Write the transformed entries to the output file synchronously
        writeFileSync(
            transformedFile,
            JSON.stringify({ entries: transformedModel })
        );
    } catch (err) {
        console.error(err);
    }
};

const logProgressInfo = async (entryTitle: string, iterator: number, totalData: number, startTime: number) => {
    const currentTime = Date.now();
    const totalTime = currentTime - startTime;
    const progress = ((iterator + 1) / totalData) * 100;
    console.log(
        `----- Progress of Published : ${entryTitle} Percentage: ${progress.toFixed(
            2
        )}% -----`
    );
    console.log(
        `----- Progress of Published : ${entryTitle} Total Time Taken: ${Math.floor(
            totalTime / 60000
        )}m ${Math.floor((totalTime % 60000) / 1000)}s -----`
    );
};
