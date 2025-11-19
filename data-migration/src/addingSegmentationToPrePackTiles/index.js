const contentful = require('contentful-management');

const script = async ({ accessToken, env, space }) => {
  const client = contentful.createClient({ accessToken })
  const LOCALE = space === "nw2595tc1jdx" ? "en-GB" : "en-US";

  client.getSpace(space)
    .then((space) => space.getEnvironment(env))
    .then(async (entries) => {

      const sportsMarqueePrePackTile = await entries.getEntries({
        limit: 400,
        content_type: 'sportsMarqueePrePackTile'
      })

      const totalEntries = sportsMarqueePrePackTile.items.length;
      let processedCount = 0;

      for (const entry of sportsMarqueePrePackTile.items) {
        processedCount++;
        try {
          const entryFields = entry.fields;

          if (entryFields) {
            entryFields.segmentation = { [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut'] };

            const updatedEntry = await entry.update();
            await updatedEntry.publish();
            console.log(`[${processedCount}/${totalEntries}] Updated PrePack Tile: ${entry.sys.id}`);
          } else {
            console.log(`[${processedCount}/${totalEntries}] Skipped PrePack Tile (no fields): ${entry.sys.id}`);
          }
        } catch (error) {
          console.error(`[${processedCount}/${totalEntries}] Error updating PrePack Tile ${entry.sys.id}:`, error.message);
        }
      }
    })
};

module.exports = script;