const contentful = require('contentful-management');

const script = async ({ accessToken, env, space }) => {
  const client = contentful.createClient({ accessToken })
  const LOCALE = space === "nw2595tc1jdx" ? "en-GB" : "en-US";

  client.getSpace(space)
    .then((space) => space.getEnvironment(env))
    .then(async (entries) => {

      const sportsParticipantLogos = await entries.getEntries({
        limit: 400, //Over rides the default limit of 100 to cover the number of Participants - not sure how high this can go
        content_type: 'sportsParticipantLogo'
      })

      for (let i = 0; i < sportsParticipantLogos.items.length; i++) {
        try {
          const entry = sportsParticipantLogos.items[i];
          const entryFields = entry.fields;

          entryFields.isUnlicensed = { [LOCALE]: entryFields.entryTitle[LOCALE].startsWith('licensed') ? false : true };

          await entry.update().then(async (updatedEntry) => {
            await updatedEntry.publish();
            console.log(`[${i + 1}/${sportsParticipantLogos.items.length}] Updated: `, entryFields.entryTitle, entryFields.isUnlicensed);
          });
        } catch (error) {
          console.error(`[${i + 1}/${sportsParticipantLogos.items.length}] Error updating entry: `, entryFields.entryTitle, error);
        }
      }
    })
};

module.exports = script;