import contentful from 'contentful-management';

const script = async ({ accessToken, env, space }) => {
  const client = contentful.createClient({ accessToken })
  const LOCALE = space === "nw2595tc1jdx" ? "en-GB" : "en-US";

  client.getSpace(space)
    .then((space) => space.getEnvironment(env))
    .then(async (environment) => {

      let allEntries = [];
      let skip = 0;
      const limit = 1000;
      let hasMoreEntries = true;

      while (hasMoreEntries) {
        const sportsParticipant = await environment.getEntries({
          limit: limit,
          skip: skip,
          content_type: 'sportsParticipant'
        });

        allEntries = allEntries.concat(sportsParticipant.items);
        
        console.log(`Fetched ${sportsParticipant.items.length} entries (skip: ${skip})`);
        
        hasMoreEntries = sportsParticipant.items.length === limit;
        skip += limit;
      }

      console.log(`Found ${allEntries.length} sportsParticipant entries to process`);

      for (let i = 0; i < allEntries.length; i++) {
        const entry = allEntries[i];
        try {
          const entryFields = entry.fields;
          const entryTitle = entryFields.entryTitle?.[LOCALE] || 'Unknown';

          // Get Participant Path
          const participantPath = entryFields.participantPath[LOCALE] || ''

          // Current participants with tennis are type PARTICIPANT, all others are type TEAM
          let typeValue;
          if (typeof participantPath === 'string' && participantPath.includes('tennis')) {
            typeValue = "PARTICIPANT";
          } else {
            typeValue = "TEAM";
          }

          entryFields.type = { [LOCALE]: typeValue };

          const updatedEntry = await entry.update();
          
          // Only publish if entry was already published
          if (entry.sys.publishedVersion) {
            await updatedEntry.publish();
            console.log(`[${i + 1}/${allEntries.length}] Updated and published: ${entryTitle} - type: ${typeValue} (path: "${participantPath}")`);
          } else {
            console.log(`[${i + 1}/${allEntries.length}] Updated (draft): ${entryTitle} - type: ${typeValue} (path: "${participantPath}")`);
          }

        } catch (error) {
          const entryTitle = entry?.fields?.entryTitle?.[LOCALE] || 'Unknown';
          console.error(`[${i + 1}/${allEntries.length}] Error updating entry: ${entryTitle}`, error.message);
        }
      }

      console.log('Migration completed!');
    })
    .catch((error) => {
      console.error('Error during migration:', error);
    });
};

export default script;