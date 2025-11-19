import contentful from 'contentful-management';
import { readFile, writeFile } from 'node:fs/promises';

export default async (new_model: string, spaceFolder: string, spaceLocale: string, targetEnv: string, targetSpace: string, old_model: any, accessToken: string = 'YOUR_ACCESS_TOKEN_HERE') => {
    try {
        const client = contentful.createClient({ accessToken });
        const space = await client.getSpace(targetSpace);
        const environment = await space.getEnvironment(targetEnv);

        const data = JSON.parse(await readFile(`./src/euNewLobbyDesign/data/${old_model}/${spaceFolder}/${new_model}.json`, 'utf-8'));
        const dataEntries = [...data.entries];
        console.log('--------------------------------');
        console.log('PUBLISHING TRANSFORMED GAME V2 ENTRIES');
        console.log('--------------------------------');
        console.log('Total Data Entries : ', dataEntries.length);

        const failedEntries = [];
        let drafts = 0;
        let updated = 0;
        let published = 0;
        let archived = 0;
        const startTime = Date.now();

        // Process each entry sequentially
        for (let i = 0; i < dataEntries.length; i++) {
            const dataEntry = dataEntries[i];
            let result = await processEntry(environment, dataEntry, i, dataEntries.length, startTime, spaceLocale);
            if ('failed' in result) {
                failedEntries.push(result.failed);
            } else {
                if (result.isArchived) archived++;
                if (result.isDraft) drafts++;
                if (result.isUpdated) updated++;
                if (result.isPublished) published++;
            }
        }

        // Write failed entries to file if any
        if (failedEntries.length > 0) {
            await writeFile(
                `./src/euNewLobbyDesign/data/${old_model}/${spaceFolder}/${new_model}-failed.json`,
                JSON.stringify(failedEntries, null, 2)
            );
        }

        console.log('--------------------------------');
        console.log('PROCESSING COMPLETE');
        console.log('--------------------------------');
        console.log('Total Entries : ', dataEntries.length);
        console.log('Total Draft Entries : ', drafts);
        console.log('Total Updated Entries : ', updated);
        console.log('Total Archived Entries : ', archived);
        console.log('Total Published Entries : ', published);
        console.log(`Failed to update/publish ${failedEntries.length} entries`);

    } catch (err) {
        console.error('Error in migration process:', err);
    }
};

async function processEntry(environment: contentful.Environment, dataEntry: { sys: { id: any; }; fields: { entryTitle: { [x: string]: any; }; }; }, index: number, total: number, startTime: number, spaceLocale: string) {
    try {
        // Get the current entry
        let entry = await environment.getEntry(dataEntry.sys.id);
        // Capture the entry's initial state
        const result = {
            isArchived: entry.isArchived(),
            isDraft: entry.isDraft(),
            isUpdated: entry.isUpdated(),
            isPublished: entry.isPublished()
        };

        // Update entry fields
        entry.fields = dataEntry.fields;
        entry = await entry.update();

        // Publish the entry if it is not archived, not a draft, and not already updated
        if (!result.isArchived && !result.isDraft && !result.isUpdated) {
            entry = await entry.publish();
        }

        logProgressInfo(dataEntry.fields.entryTitle[spaceLocale], index, total, startTime, entry.sys.id);
        return result;
    } catch (err) {
        console.error(`Failed to update/publish ${dataEntry.fields.entryTitle[spaceLocale]}:`, err);
        return {
            failed: {
                title: dataEntry.fields.entryTitle[spaceLocale],
                id: dataEntry.sys.id,
                error: err.message
            }
        };
    }
}

const logProgressInfo = (entryTitle, iterator, totalData, startTime, id) => {
    const currentTime = Date.now();
    const totalTime = currentTime - startTime;
    const progress = ((iterator + 1) / totalData) * 100;
    console.log(`----- [${progress.toFixed(2)}%] [${Math.floor(totalTime / 60000)}m ${Math.floor((totalTime % 60000) / 1000)}s] item : ${id} - ${entryTitle} -----`);
};
