import contentful from 'contentful-management';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const participants = JSON.parse(await readFile(path.resolve(__dirname, './participants.json'), 'utf8'));

// Both Logos and Colours will be a manual process within Contentful whilst using apps
// const createParticipantFields = (data) => ({
//   entryTitle: { [LOCALE]: (data.englishNameV2) },
//   name: { [LOCALE]: (data.name) },
//   englishName: { [LOCALE]: (data.englishName) },
//   englishNameV2: { [LOCALE]: (data.englishNameV2) },
//   abbreviation: { [LOCALE]: (data.abbreviation && data.abbreviation.toUpperCase()) },
//   alternativeName: { [LOCALE]: (data.alternativeName) },
//   shortName: { [LOCALE]: (data.shortName) },
//   stadium: { [LOCALE]: (data.stadium) },
// })

const createParticipantLogoFields = (data) => ({
  entryTitle: { [LOCALE]: (`unlicensed_${data.englishName}_logo`) },
})

// const createParticipant = async (fields, environment) => {
//   const entry = await environment.createEntry('sportsParticipant', { fields });
//   await entry.publish();
// };

const createParticipantLogo = async (fields, environment) => {
  const entry = await environment.createEntry('sportsParticipantLogo', { fields });
  await entry.publish();
};

// const createParticipants = (environment, participants, entriesNames) => {
//   participants
//     .filter((participant) => !entriesNames.includes(participant.name))
//     .forEach((participant, i) => {
//       setTimeout(() => {
//         const fields = createParticipantFields(participant);
//         createParticipant(fields, environment);
//       }, i * 400);
//       console.log('Participant Created: ', participant.name)
//     });
// };

const createParticipantsLogo = (environment, participants, entriesNames) => {
  participants
    .filter((participant) => !entriesNames.includes(participant.entryTitle))
    .forEach((participant, i) => {
      setTimeout(() => {
        const fields = createParticipantLogoFields(participant);
        createParticipantLogo(fields, environment);
      }, i * 400);
      console.log('Participant Logo Created: ', participant.entryTitle)
    });
};

const script = async ({ accessToken, env, space }) => {
  const LOCALE = space === "nw2595tc1jdx" ? "en-GB" : "en-US";

  try {
    const client = contentful.createClient({ accessToken });
    const spaceID = await client.getSpace(space);
    const environment = await spaceID.getEnvironment(env);
    const entries = await environment.getEntries({
      content_type: 'sportsParticipantLogo'
    });
    const entriesNames = entries.items.map((entry) => entry.fields.entryTitle[LOCALE]);

    // createParticipants(environment, participants, entriesNames);
    createParticipantsLogo(environment, participants, entriesNames);
  } catch (error) {
    console.log({ error });
  }
};

export default script;
