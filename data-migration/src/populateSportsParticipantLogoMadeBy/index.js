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
        // Only get entries that have unlicensed logos and a logo field
        const sportsParticipantLogos = await environment.getEntries({
          limit: limit,
          skip: skip,
          content_type: 'sportsParticipantLogo',
          'fields.isUnlicensed': true,
          'fields.logo[exists]': true
        });

        allEntries = allEntries.concat(sportsParticipantLogos.items);
        
        console.log(`Fetched ${sportsParticipantLogos.items.length} entries (skip: ${skip})`);
        
        hasMoreEntries = sportsParticipantLogos.items.length === limit;
        skip += limit;
      }

      console.log(`Found ${allEntries.length} sportsParticipantLogo entries to process`);

      for (let i = 0; i < allEntries.length; i++) {
        const entry = allEntries[i];
        try {
          const entryFields = entry.fields;
          const entryTitle = entryFields.entryTitle?.[LOCALE] || 'Unknown';

          // Get Bynder image
          const firstBynderImage = entryFields.logo[LOCALE][0];

          // Get the description from the Bynder image
          const imageDescription = firstBynderImage.description || '';

          // Logos made by the assets scripts have a "Participant asset" description, so we use that to determine the madeBy value
          let madeByValue;
          if (imageDescription === "Participant asset") {
            madeByValue = "AI";
          } else {
            madeByValue = "Design";
          }

          // Update the madeBy field
          entryFields.madeBy = { [LOCALE]: madeByValue };

          const updatedEntry = await entry.update();
          
          // only publish if entry was already published
          if (entry.sys.publishedVersion) {
            await updatedEntry.publish();
            console.log(`[${i + 1}/${allEntries.length}] Updated and published: ${entryTitle} - madeBy: ${madeByValue} (description: "${imageDescription}")`);
          } else {
            console.log(`[${i + 1}/${allEntries.length}] Updated (draft): ${entryTitle} - madeBy: ${madeByValue} (description: "${imageDescription}")`);
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
