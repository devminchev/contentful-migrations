const contentful = require('contentful-management');
const participantData = require('./participants.json');

const script = async ({ accessToken, env, space }) => {
  const client = contentful.createClient({ accessToken })
  const LOCALE = space === "nw2595tc1jdx" ? "en-GB" : "en-US";

  client.getSpace(space)
    .then((space) => space.getEnvironment(env))
    .then(async (entries) => {

      const sportsParticipants = await entries.getEntries({
        limit: 1000, //Over rides the default limit of 100 to cover the number of Participants - not sure how high this can go
        content_type: 'sportsParticipant'
      })

      for (let i = 0; i < sportsParticipants.items.length; i++) {
        try {

          const entry = sportsParticipants.items[i];
          const entryFields = entry.fields;

          const participant = participantData.find(data => data.participantPath === entryFields.participantPath[LOCALE]);
          if (participant) {

            entryFields.participantKeys = { [LOCALE]: participant.id };

            await entry.update().then(async (updatedEntry) => {
              await updatedEntry.publish();
              console.log(`[${i + 1}/${sportsParticipants.items.length}] Updated: `, entryFields.entryTitle);
            });
          }
        } catch (error) {
          console.error(`[${i + 1}/${sportsParticipants.items.length}] Error updating entry: `, entryFields.entryTitle, error);
        }
      }
    })
};

module.exports = script;
