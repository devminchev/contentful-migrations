
import contentful from 'contentful-management';
import { readFileSync } from 'node:fs';

const SPACE_ID=process.env.SPACE_ID;
const LOCALE=process.env.LOCALE;
const provider=process.env.PROVIDER;
const accessToken=process.env.ACCESS_TOKEN;
const env=process.env.ENV;
const vendor=process.env.VENDOR;
const jurisdiction = process.env.JURISDICTION;

const migrateProviderGames = async() =>{
    console.log('Starting migration')
    const client = contentful.createClient({ accessToken });
    const s = await client.getSpace(SPACE_ID);
    const environment = await s.getEnvironment(env);

    const siteGameData = JSON.parse(readFileSync(`./src/providerGames/data/${provider}-${jurisdiction}.json`, 'utf8'));
    
    for (const data of siteGameData) {
        const siteGameEntryId = data.siteGameEntryId;
        const entry = await environment.getEntry(siteGameEntryId);
        console.log(`Updating vendor for ${entry.fields.entryTitle[LOCALE]} from ${ entry.fields.vendor[LOCALE] } to ${vendor}`);
        entry.fields.vendor[LOCALE] = vendor;
        const updatedEntry = await entry.update();
        const publishedEntry = await updatedEntry.publish();
        console.log(`entryID ${siteGameEntryId} Published successfully`);
    }

}
export default migrateProviderGames;
