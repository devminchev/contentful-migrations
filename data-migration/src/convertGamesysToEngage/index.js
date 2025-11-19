import contentful from 'contentful-management';
import { excludedGames } from './excludedGames.js';

const script = (async ({ accessToken, env }) => {
    const client = contentful.createClient({ accessToken });
    const SPACE_ID = 'nw2595tc1jdx';
    const LOCALE = 'en-GB';

    try {
        const space = await client.getSpace(SPACE_ID);
        const environment = await space.getEnvironment(env);
        const howManyThousandGames = 4;

        const getAllGamesysGames = (environment) => {
            const promises = [];

            for (let i = 0; i < howManyThousandGames; i++) {
                promises.push(environment.getEntries({
                    'content_type': 'siteGame',
                    'fields.vendor': 'gamesys',
                    'sys.archivedAt[exists]': false,
                    'limit': 1000,
                    'skip': i * 1000
                }));
            }

            return Promise.all(promises);
        };

        const allGamesysGames = await getAllGamesysGames(environment);
        let flatAllGamesysGames = [];

        allGamesysGames.forEach((batch) => {
            flatAllGamesysGames = flatAllGamesysGames.concat(batch.items);
        });

        console.log(`ALL GAMESYS GAMES FOUND: ${flatAllGamesysGames.length}`);

        flatAllGamesysGames = flatAllGamesysGames.filter(game => !excludedGames.includes(game.fields.name[LOCALE]));

        console.log(`GAMESYS GAMES TO BE CONVERTED: ${flatAllGamesysGames.length}`);

        flatAllGamesysGames.forEach(async (game, i) => {
            setTimeout(() => {
                game.fields.vendor[LOCALE] = 'roxor-rgp';
                const matchedVentures = game.fields.entryTitle[LOCALE].match(/virgingames|heart|jackpotjoy/g)
                if (matchedVentures) {
                    game.fields.chat[LOCALE] = {
                        "isEnabled": true,
                        "controlMobileChat": true
                    }
                }
                game.update().then((updatedGame) => {
                    updatedGame.publish();
                });

                console.log(`[${new Date().toLocaleTimeString()}] #${i} - Converted ${game.fields.entryTitle[LOCALE]} to roxor-rgp`);
            }, i * 400);
        });
    } catch (e) {
        console.error(e);
    }
});

export default script;
