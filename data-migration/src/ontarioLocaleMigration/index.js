import contentful from 'contentful-management';
import { enUSRegex, enCARegex, delay } from './utils.js';
import { retrieveUpdateAndPublishGameInfoEntries, updateAndPublishGameEntries } from './functions.js';
const northAmericaSpaceId = '6hs6aj69c5cq';
const ballysCasinoOntarioVentureId = '5P0vwBtt5NW4GecZ1MfIw2';

const script = (async({ accessToken, env }) => {
    const client = await contentful.createClient({
        accessToken,
    });

    const space = await client.getSpace(northAmericaSpaceId);
    const environment = await space.getEnvironment(env);

    const gameEntries = await environment.getEntries({
        limit: 1000,
        content_type: 'game',
        'fields.venture.sys.id': ballysCasinoOntarioVentureId,
        'sys.archivedAt[exists]': 'false',
    });

    const gameEntriesToUpdate = [];
    const gameInfoIds = [];
    gameEntries.items.forEach(async (item) => {
        let itemChanged = false;
        if (item.fields.gameInfo['en-US']) {
            item.fields.gameInfo = {
                'en-CA': item.fields.gameInfo['en-US'],
            }
            itemChanged = true;
        }

        const gameEntryTitle = item.fields.entryTitle['en-US'];
        if (enUSRegex.test(gameEntryTitle)) {
            item.fields.entryTitle['en-US'] = gameEntryTitle.replace(enUSRegex, '[en-CA]').trim();
            itemChanged = true;
        } else if (!enCARegex.test(gameEntryTitle)) {
            item.fields.entryTitle['en-US'] = `${gameEntryTitle} [en-CA]`;
            itemChanged = true;
        }

        if (itemChanged) {
            gameEntriesToUpdate.push(item);
        }

        gameInfoIds.push(item.fields.gameInfo['en-CA'].sys.id);
    });

    await retrieveUpdateAndPublishGameInfoEntries(environment, gameInfoIds);
    await updateAndPublishGameEntries(gameEntriesToUpdate);

});

export default script;
