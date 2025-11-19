import contentful from 'contentful-management';
import metadataDictionary from './data/metadata.json' assert { type: 'json' };

/**
 * Validation at runtime to ensure the metadata is valid
 * @param {Object} metadata - The metadata object to validate
 * @returns {boolean} - true if valid, false if invalid
 */
const validateMetadata = (metadata) => {
  if (typeof metadata !== 'object') {
    return false;
  }
  
  if (!metadata.white || !metadata.black || !metadata.template) {
    return false;
  }
  
  if (!metadata.white.startsWith('#') || !metadata.black.startsWith('#')) {
    return false;
  }
  
  return true;
};

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
          content_type: 'sportsParticipantLogo'
        });

        allEntries = allEntries.concat(sportsParticipant.items);
        
        console.log(`Fetched ${sportsParticipant.items.length} entries (skip: ${skip})`);
        
        hasMoreEntries = sportsParticipant.items.length === limit;
        skip += limit;
      }

      console.log(`Found ${allEntries.length} sportsParticipantLogo entries to process`);

      for (let i = 0; i < allEntries.length; i++) {
        const entry = allEntries[i];
        try {
          const entryFields = entry.fields;
          const entryTitle = entryFields.entryTitle?.[LOCALE] || 'Unknown';

          const metadataEntry = metadataDictionary[entryTitle];

          if (!metadataEntry) {
            console.log(`[${i + 1}/${allEntries.length}] Skipped (no metadata found): ${entryTitle}`);
            continue;
          }

          // Validate metadata before applying
          if (!validateMetadata(metadataEntry)) {
            console.log(`[${i + 1}/${allEntries.length}] Skipped (invalid metadata): ${entryTitle}`);
            console.log(`  Metadata: ${JSON.stringify(metadataEntry)}`);
            continue;
          }

          entryFields.metadata = { [LOCALE]: metadataEntry };

          const updatedEntry = await entry.update();
          
          // Only publish if entry was already published
          if (entry.sys.publishedVersion) {
            await updatedEntry.publish();
            console.log(`[${i + 1}/${allEntries.length}] Updated and published: ${entryTitle} - metadata: ${JSON.stringify(metadataEntry)}`);
          } else {
            console.log(`[${i + 1}/${allEntries.length}] Updated (draft): ${entryTitle} - metadata: ${JSON.stringify(metadataEntry)}`);
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