const contentful = require('contentful-management');

const script = async ({ accessToken, env, space }) => {
  const client = contentful.createClient({ accessToken });
  const LOCALE = space === "nw2595tc1jdx" ? "en-GB" : "en-US";

  const contentTypes = [
    'dxTabs',
    'dxQuickLinks', 
    'dxMarquee',
    'dxHeader',
    'dxBanners',
    'dxPromotions'
  ];

  const defaultVisibility = ['xs', 'sm', 'md', 'lg', 'blg', 'xl'];

  try {
    const spaceObj = await client.getSpace(space);
    const environment = await spaceObj.getEnvironment(env);

    console.log(`Starting visibility field migration for environment: ${env}`);
    console.log(`Target content types: ${contentTypes.join(', ')}`);

    for (const contentTypeId of contentTypes) {
      console.log(`\n=== Processing content type: ${contentTypeId} ===`);

      try {
        const entries = await environment.getEntries({
          content_type: contentTypeId,
          limit: 1000
        });

        for (let i = 0; i < entries.items.length; i++) {
          const entry = entries.items[i];
          const entryFields = entry.fields;

          try {
            if (entryFields.visibility && entryFields.visibility[LOCALE].length) {
              console.log(`[${i + 1}/${entries.items.length}] Skipped (already has visibility): ${entryFields.entryTitle?.[LOCALE] || entry.sys.id}`);
              continue;
            }

                         entryFields.visibility = { [LOCALE]: defaultVisibility };

             const updatedEntry = await entry.update();
             
             // only publish if entry was already published
             if (entry.sys.publishedVersion) {
               await updatedEntry.publish();
               console.log(`[${i + 1}/${entries.items.length}] Updated and published: ${entryFields.entryTitle?.[LOCALE] || entry.sys.id}`);
             } else {
               console.log(`[${i + 1}/${entries.items.length}] Updated (draft): ${entryFields.entryTitle?.[LOCALE] || entry.sys.id}`);
             }

          } catch (error) {
            console.error(`[${i + 1}/${entries.items.length}] Error updating entry ${entryFields?.entryTitle?.[LOCALE] || entry.sys.id}:`, error.message);
          }
        }

        console.log(`Completed processing ${contentTypeId}`);

      } catch (error) {
        console.error(`Error processing content type ${contentTypeId}:`, error.message);
      }
    }

    console.log('\n=== Migration completed ===');

  } catch (error) {
    console.error('Fatal error during migration:', error.message);
    throw error;
  }
};

module.exports = script; 