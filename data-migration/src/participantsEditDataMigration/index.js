import contentful from 'contentful-management';

// Add Participant spreadsheet in participantsDataMigration and run python script to create JSON file
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const participants = JSON.parse(await readFile(path.resolve(__dirname, '../participantsDataMigration/participants.json'), 'utf8'));


const script = async ({ accessToken, env, space }) => {
  const client = contentful.createClient({ accessToken })
  const LOCALE = space === "nw2595tc1jdx" ? "en-GB" : "en-US";

  client.getSpace(space)
    .then((space) => space.getEnvironment(env))
    .then(async (entries) => {
      let contentfulParticipants = [];
      contentfulParticipants.push(
        await entries.getEntries({
          limit: 200, //Over rides the default limit of 100 to cover the number of Participants - not sure how high this can go
          content_type: 'sportsParticipant'
        })
      )
      return contentfulParticipants;
    })
    .then(async (entrances) => {
      await entrances[0].items.forEach(async (entry, i) => {
        setTimeout(() => {
          participants.filter(async (participant) => {
            // Best using englishName (later englishNameV2) for the checks
            if (entry.fields.englishName[LOCALE] === participant.englishName) {
              // Update below to reflect the field that needs to be updated 
              // e.g. entry.fields.stadium = {[LOCALE]: participant.stadium} 
              // The above will update the stadium field in Contentful with the stadium data in participants.json for any matching participants

              // Select fields to update
              // entry.fields.name = { [LOCALE]: (participant.name) }
              // entry.fields.englishName = { [LOCALE]: (participant.englishName) }
              entry.fields.participantPath = { [LOCALE]: (participant.englishNameV2) }
              // entry.fields.abbreviation = { [LOCALE]: (participant.abbreviation) }
              // entry.fields.alternativeName = { [LOCALE]: (participant.alternativeName) }
              // entry.fields.shortName = { [LOCALE]: (participant.shortName) }
              // entry.fields.stadium = { [LOCALE]: (participant.stadium) }
              // entry.fields.secondaryColor = { [LOCALE]: (participant.secondaryColor) }
              await entry.update()
                .then(async (updatedEntry) => {
                  await updatedEntry.publish()
                  console.log('Updated: ', entry.fields.name)
                })
            }
          })
        }, i * 400);
      })
    })
};

export default script;
