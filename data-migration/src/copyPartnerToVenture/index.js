import  contentful  from 'contentful-management';

import copyGames from './copyGames.js';
import copySiteGames from './copySiteGames.js';
import copySections from './copySections.js';
import copyLayouts from './copyLayouts.js';
import copyCategories from './copyCategories.js';
import copyNativeCategories from './copyNativeCategories.js';
import copyMiniGames from './copyMiniGames.js';
import copyRecommendedGames from './copyRecommendedGames.js';

const DEFAULT_LOCALE = 'en-GB';

export default async ({ accessToken, env, locale, venture, partner }) => {
    const client = contentful.createClient({
        accessToken: accessToken
    });
    try {
        const space = await client.getSpace('nw2595tc1jdx');
        const environment = await space.getEnvironment(env);

        const sourceVenture = await environment.getEntries({
            content_type: 'venture',
            'fields.name': venture
        });

        console.log(new Date().toLocaleTimeString(), 'CREATE NEW VENTURE');

        const targetPartner = await environment.createEntry('venture', {
            fields: {
                entryTitle: { 'en-GB': partner },
                name: { 'en-GB': partner },
                jurisdiction: { 'en-GB': { sys: { type: 'link', linkType: 'Entry', id: sourceVenture.items[0].fields.jurisdiction[DEFAULT_LOCALE].sys.id } } }
            }
        });
        await targetPartner.publish();

        await copyGames(environment, locale, venture, sourceVenture, partner, targetPartner);

        await copySiteGames(environment, locale, venture, sourceVenture, partner, targetPartner);

        await copySections(environment, locale, venture, sourceVenture, partner, targetPartner);

        await copyLayouts(environment, locale, venture, sourceVenture, partner, targetPartner);

        await copyCategories(environment, locale, venture, sourceVenture, partner, targetPartner);

        await copyNativeCategories(environment, locale, venture, sourceVenture, partner, targetPartner);

        await copyMiniGames(environment, locale, venture, sourceVenture, partner, targetPartner);

        await copyRecommendedGames(environment, locale, venture, sourceVenture, partner, targetPartner);
    } catch(e){
        console.error(e)
    }
};
