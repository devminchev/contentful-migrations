import contentful from 'contentful-management';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const _data = JSON.parse(await readFile(path.resolve(__dirname, './data/sports.json'), 'utf8'));
const NA_SPACE_ID = '6hs6aj69c5cq';
const LOCALE = 'en-US';

const createSportFields = (data) => ({
  entryTitle: { [LOCALE]: (data.name && data.name.toLowerCase()) || null },
  name: { [LOCALE]: data.name || null },
  id: { [LOCALE]: data.id || null },
  type: { [LOCALE]: (data.__typename && data.__typename.toLowerCase()) || null },
});

const createSport = async (fields, environment) => {
  const entry = await environment.createEntry('sportsSport', { fields });
  await entry.publish();

  console.log('Sport created: ', fields.entryTitle);
};

const createSports = (environment, sports, entriesIds) => {
  // filter any sport entries that already exist within the CMS
  sports
    .filter((sport) => !entriesIds.includes(sport.id))
    .forEach((sport, i) => {
      setTimeout(() => {
        const fields = createSportFields(sport);
        createSport(fields, environment);
      }, i * 400);
    });
};

const script = async ({ accessToken, env }) => {
  try {
    const client = contentful.createClient({ accessToken });
    const space = await client.getSpace(NA_SPACE_ID);
    const environment = await space.getEnvironment(env);
    const entries = await environment.getEntries({
      content_type: 'sportsSport',
    });
    const entriesIds = entries.items.map((entry) => entry.fields.id[LOCALE]);

    createSports(environment, _data.sports, entriesIds);
  } catch (error) {
    console.error({ error });
  }
};

export default script;
