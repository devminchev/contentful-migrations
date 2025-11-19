const contentful = require('contentful-management');

const processContentType = async (entriesToProcess, contentType, LOCALE) => {
    // Get all content entries of the given content type:
    const entries = await entriesToProcess.getEntries({
        content_type: contentType
    });

    // Iterate over all content entries:
    for (const [index, entry] of entries.items.entries()) {
        try {
            // Get the current entry and its fields:
            const entryFields = entry.fields;

            if(!entryFields)
                continue;

            // Get the uiStyle field:
            const uiStyle = entryFields.uiStyle;

            // If there is an uiStyle field, we need to update the uiStyleType field accordingly:
            if (uiStyle && uiStyle[LOCALE] && uiStyle[LOCALE].sys && uiStyle[LOCALE].sys.id) {
                const uiStyleId = uiStyle[LOCALE].sys.id;
                // Get the current Dx Tabs UI Style entry and its fields:
                const dxTabsUiStyleEntry = await entriesToProcess.getEntry(uiStyleId);
                const dxTabsUiStyleEntryFields = dxTabsUiStyleEntry.fields;

                // Get the type field value for the correct locale:
                const typeField = dxTabsUiStyleEntryFields.type;
                const typeValue = typeField?.[LOCALE] ?? typeField?.['en-US'] ?? typeField?.['en-GB'] ?? 'STANDARD';
                // Update the new uiStyleType field to hold the old value of uiStyle->type (or default):
                entryFields.uiStyleType = { [LOCALE]: typeValue };

                const updatedEntry = await entry.update();
                if (entry.sys.publishedVersion) {
                    await updatedEntry.publish();
                    console.log(`[${index + 1}/${entries.items.length}] ${contentType} entry updated and published`);
                } else {
                    console.log(`[${index + 1}/${entries.items.length}] ${contentType} entry updated (draft)`);
                }
            } else {
                // No uiStyle reference; backfill default value
                entryFields.uiStyleType = { [LOCALE]: 'STANDARD' };

                const updatedEntry = await entry.update();
                if (entry.sys.publishedVersion) {
                    await updatedEntry.publish();
                    console.log(`[${index + 1}/${entries.items.length}] ${contentType} entry defaulted to STANDARD and published`);
                } else {
                    console.log(`[${index + 1}/${entries.items.length}] ${contentType} entry defaulted to STANDARD (draft)`);
                }
            }
        }
        catch (error) {
            console.error(`[${index + 1}/${entries.items.length}] Error updating ${contentType} entry`);
        }
    }
}

const script = async ({ accessToken, env, space }) => {
  const client = contentful.createClient({ accessToken })
  const LOCALE = space === "nw2595tc1jdx" ? "en-GB" : "en-US";

  client.getSpace(space)
    .then((space) => space.getEnvironment(env))
    .then(async (entries) => {

        // Store all content types that need to be processed:
        const contentTypes = [
            'dxTabs',
            'dxTabsGroup',
            'sportsPrePackTabGroup',
            'sportsParlayBuilderTabGroup'
        ];

        // Process each content type:
        for (const contentType of contentTypes) {
            await processContentType(entries, contentType, LOCALE);
        }
    })
};

module.exports = script;
