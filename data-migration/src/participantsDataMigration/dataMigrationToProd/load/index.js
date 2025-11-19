import { createClient } from 'contentful-management';
import { readFile } from 'node:fs/promises';

const MODEL = 'sportsParticipant'; //Enter Model that needs importing to Contentful i.e 'sportsParticipant'

const script = async (variables) => {
  try {
    const client = createClient({ accessToken: variables.accessToken });
    const space = await client.getSpace(variables.space);
    const environment = await space.getEnvironment(variables.env);

    const data = JSON.parse(await readFile(`./src/participantsDataMigration/dataMigrationToProd/extract/${MODEL}.json`, 'utf-8'));
    const dataEntries = [...data.entries];
    const publishedData = [];

    for (dataEntry of dataEntries){
      const dataFields = dataEntry.fields;
      let entry = await environment.createEntry(MODEL, {
          fields: {
              ...dataFields
          },
      });
      entry = await entry.publish();

      console.log(`Published: ${dataFields.entryTitle}`);

      publishedData.push(entry);

      const index = data.entries.findIndex(entry => entry.fields.entryTitle === dataEntry.fields.entryTitle);
      data.entries.splice(index, 1);
    }
  } catch (err) {
      console.error(err);
  }
};

export default script;
