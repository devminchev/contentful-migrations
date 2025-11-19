import contentful from 'contentful-management';
import { readFile, writeFile } from 'node:fs/promises';
import Bottleneck from 'bottleneck';

const RATE_LIMIT = 5; // 5 requests per second

const limiter = new Bottleneck({
    minTime: 1400 / RATE_LIMIT, // Minimum time between requests
    maxConcurrent: 2 // Max number of concurrent requests
});

export const updateData = async (
    new_model: string,
    spaceFolder: string,
    spaceLocale: string, targetEnv: string, targetSpace: string, old_model: string,
    accessToken: string
) => {
    try {
        const client = contentful.createClient({ accessToken });
        const space = await client.getSpace(targetSpace);
        const environment = await space.getEnvironment(targetEnv);

        const data = JSON.parse(await readFile(`./src/naNewLobbyDesign/data/${old_model}/${spaceFolder}/${new_model}.json`, 'utf-8'));
        const dataEntries = [...data.entries];
        console.log('Total Data Entries : ', dataEntries.length);

        const failedEntries = [];
        let drafts = 0;
        let updated = 0;
        let published = 0;
        let archived = 0;
        let iterator = 0;
        const startTime = Date.now();

        const results = await Promise.all(dataEntries.map((dataEntry, index) =>
            limiter.schedule(() => processEntry(environment, dataEntry, index, dataEntries.length, startTime, spaceLocale))
        ));

        results.forEach(result => {
            if (result.failed) {
                failedEntries.push(result.failed);
            } else {
                if (result.isArchived) archived++;
                if (result.isDraft) drafts++;
                if (result.isUpdated) updated++;
                if (result.isPublished) published++;
            }
        });

        // Write failed entries to file
        if (failedEntries.length > 0) {
            await writeFile(
                `./src/naNewLobbyDesign/data/${old_model}/${spaceFolder}/${new_model}-failed.json`,
                JSON.stringify(failedEntries, null, 2)
            );
        }

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

async function processEntry(environment: contentful.Environment, dataEntry: contentful.Entry, index: number, total: number, startTime: number, spaceLocale: string) {
    try {
        let entry = await environment.getEntry(dataEntry.sys.id);
        const result = {
            isArchived: entry.isArchived(),
            isDraft: entry.isDraft(),
            isUpdated: entry.isUpdated(),
            isPublished: entry.isPublished()
        };

        entry.fields = dataEntry.fields;
        entry = await entry.update();

        if (!result.isArchived && !result.isDraft && !result.isUpdated) {
            entry = await entry.publish();
        }

        logProgressInfo(dataEntry.fields.entryTitle[spaceLocale], index, total, startTime, entry.sys.id);

        return result;
    } catch (err) {
        console.error(`Failed to update/publish ${dataEntry.fields.entryTitle[spaceLocale]}`, err);
        return {
            failed: {
                title: dataEntry.fields.entryTitle[spaceLocale],
                id: dataEntry.sys.id,
                error: err.message
            }
        };
    }
}

const logProgressInfo = (entryTitle: string, iterator: number, totalData: number, startTime: number, id: string) => {
    const currentTime = Date.now();
    const totalTime = currentTime - startTime;
    const progress = ((iterator + 1) / totalData) * 100;
    console.log(`----- [${progress.toFixed(2)}%] [${Math.floor(totalTime / 60000)}m ${Math.floor((totalTime % 60000) / 1000)}s] item : ${id} - ${entryTitle} -----`);
};
