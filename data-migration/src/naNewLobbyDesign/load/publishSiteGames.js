const contentful = require('contentful-management');
const { readFile } = require('fs/promises');
const { writeFileSync, writeFile } = require('fs');

module.exports = async (
    new_model,
    spaceFolder,
    spaceLocale,
    targetEnv,
    targetSpace,
    old_model,
    accessToken,
    outputFiles = {} // Object to optionally override file paths
) => {
    try {
        const client = contentful.createClient({ accessToken });
        const space = await client.getSpace(targetSpace);
        const environment = await space.getEnvironment(targetEnv);

        // Set default file paths based on passed parameters
        const defaultOutputFiles = {
            data: `./src/naNewLobbyDesign/data/${old_model}/${spaceFolder}/${new_model}.json`,
            failed: `./src/naNewLobbyDesign/data/${old_model}/${spaceFolder}/${old_model}-failed.json`,
            transformed: `./src/naNewLobbyDesign/data/${old_model}/${spaceFolder}/${old_model}-transformed.json`
        };

        // Merge defaults with any provided overrides
        const { data: dataFile, failed: failedFile, transformed: transformedFile, migratedRecords = '' } = {
            ...defaultOutputFiles,
            ...outputFiles
        };

        // Read existing successfully migrated keys or start fresh.
        let successfullyMigratedGames = [];
        if (fs.existsSync(migratedRecords)) {
            successfullyMigratedGames = JSON.parse(fs.readFileSync(migratedRecords, 'utf8'));
        } else {
            console.log('Fresh migration: succesfullyMigratedGames file not found.');
        }

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
            console.log(`${new_model} Iterator : `, iterator);

            let entry = await environment.createEntry(new_model, {
                fields: { ...dataFields }
            });

            try {
                entry = await entry.publish();
                transformedModel.push(entry);

                logProgressInfo(dataFields.entryTitle[spaceLocale], iterator, dataEntries.length, startTime);

                successfullyMigratedGames.push(uniqueKey);
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

        if (migratedRecords !== '') {
            writeFileSync(
                migratedRecords,
                JSON.stringify(successfullyMigratedGames)
            );
        }
        // Write the transformed entries to the output file synchronously
        writeFileSync(
            transformedFile,
            JSON.stringify({ entries: transformedModel })
        );
    } catch (err) {
        console.error(err);
    }
};

const logProgressInfo = async (entryTitle, iterator, totalData, startTime) => {
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
