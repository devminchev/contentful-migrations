// @ts-ignore
import { writeFile, readFile } from 'node:fs/promises';
// @ts-ignore
import contentful from 'contentful-management';
import { SECTION } from "../constant.js";

const script = async (accessToken, env, spaceID, spaceFolder, spaceLocale) => {
  const secError = [];
  try {

    const updatedSections = JSON.parse(await readFile(`./src/layoutMigrationV2/data/${spaceFolder}/${SECTION}-updated.json`, 'utf-8'));
    const noGamesSections = JSON.parse(await readFile(`./src/layoutMigrationV2/data/${spaceFolder}/${SECTION}-no-games.json`, 'utf-8'));
    const client = contentful.createClient({ accessToken });
    const space = await client.getSpace(spaceID);
    const environment = await space.getEnvironment(env);
    const totalEntries = updatedSections.length;

    console.log('Total Number of All Sections WITH Games : ', totalEntries);
    console.log('Total Number of All Sections WITHOUT Games: ', noGamesSections.length);
    console.log('-----------------------------------------------------------');

    for (let i = 0; i < totalEntries; i++) {
      const section = updatedSections[i];
      try {
        const entry = await environment.getEntry(section.id);
        const gamesList = [...entry.fields.games[spaceLocale], ...section.gamesV2[spaceLocale]];

        entry.fields.games[spaceLocale] = gamesList;
        if (entry.fields.games[spaceLocale] && entry.fields.games[spaceLocale].length >= 500) {
          entry.fields.games[spaceLocale] = null; // Only for allGames where entries are more than 500
        }
        const updatedEntry = await entry.update();
        const publishedEntry = await updatedEntry.publish()
        console.log(publishedEntry.sys.id, section.name, `Updated ${i} of ${totalEntries} entries.`)
      } catch (error) {
        console.log('Update Sections Operation Error: ', error);
        const err = JSON.parse(error.message);
        secError.push({ name: section.name, error: err.message, id: section.id })
      }
      console.log(`TOTAL ENTRIES => ${totalEntries}, SUCCESS => ${i}, FAILED => ${secError.length}`)
    }
  } catch (error) {
    console.error({ error });
  }
  await writeFile(`./src/layoutMigrationV2/data/${spaceFolder}/${SECTION}-failed-mapping-error.json`, JSON.stringify(
    secError
  ));
};

export default script;
