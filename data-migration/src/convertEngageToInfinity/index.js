const contentful = require('contentful-management');
const { includedGames } = require('./engageExclusivesUkv1'); // Engage Exclusives UK
// const { includedGames } = require('./engageExclusivesSpainv1'); // Engage Exclusives Spain
// const { includedGames } = require('./bngSpainv1'); // Spain Bingo
// const { includedGames } = require('./hbr_slotsmastersv1'); // Hungry Bear Slots Masters UK and Spain
// Note: Each provider requires 2 runs. One with 'releaseToProd' flag set to false to do staging, then the flag to true to do live.

const script = (async ({ accessToken, env }) => {
    const client = contentful.createClient({ accessToken });
    const SPACE_ID = 'nw2595tc1jdx';
    const LOCALE = 'en-GB';

    // change these two to switch between testing changes (not master environment), staging changes and production changes
    const testing = false;
    const releaseToProd = false;

    let vendor = 'engage';
    if (releaseToProd) {
        vendor = 'infinity';
    }

    if (testing && env==='master') {
        throw new Error('Do not test on live!');
    }

    try {
        const space = await client.getSpace(SPACE_ID);
        const environment = await space.getEnvironment(env);
        const howManyThousandGames = 20;

        const getAllGamesysGames = (environment) => {
            const promises = [];

            for (let i = 0; i < howManyThousandGames; i++) {
                promises.push(environment.getEntries({
                    'content_type': 'siteGame',
                    'fields.vendor': vendor,
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

        console.log(`ALL GAMES FOUND: ${ flatAllGamesysGames.length }`);

        // Provided list to match game by name
        // flatAllGamesysGames = flatAllGamesysGames.filter(game => includedGames.includes(game.fields.name[LOCALE]));

        // Provided list to match game by entryTitle
        flatAllGamesysGames = flatAllGamesysGames.filter(game => includedGames.includes(game.fields.entryTitle[LOCALE]));

        // Provided list to match pattern with name field
        // flatAllGamesysGames = flatAllGamesysGames.filter(game => includedGames.some(element => game.fields.name[LOCALE].startsWith(element)));

        // Provided list to match pattern with gameLoaderFileName
        //flatAllGamesysGames = flatAllGamesysGames.filter(game => includedGames.some(element => game.fields.gameLoaderFileName[LOCALE].startsWith(element)));

        console.log(`GAMES FROM INCLUDE LIST: ${ flatAllGamesysGames.length }`);

        /*
         filter ventures to avoid spain issues with same games
         UK .match(/virgingames|doublebubblebingo|jackpotjoy|ballyuk|rainbowriches|monopolycasino/g)
         Spain .match(/canalbingo|monopolycasinospain|botemania/g)

         monopolycasino and monopolycasinospain share text and can get tricky
         */
         
        flatAllGamesysGames = flatAllGamesysGames.filter(game => game.fields.entryTitle[LOCALE].match(/virgingames|doublebubblebingo|jackpotjoy|ballyuk|rainbowriches|monopolycasino/g));
        flatAllGamesysGames = flatAllGamesysGames.filter(game => !game.fields.entryTitle[LOCALE].match(/canalbingo|monopolycasinospain|botemania/g));

        console.log(`ENGAGE GAMES TO BE CONVERTED: ${ flatAllGamesysGames.length }`);

        flatAllGamesysGames.forEach(async (game, i) => {
            setTimeout(() => {
                try {
                    if (testing) {
                        game.fields.vendor[LOCALE] = 'engage';
                        game.update().then((updatedGame) => {
                            updatedGame.publish();
                        });
    
                        console.log(`[${ new Date().toLocaleTimeString() }] #${ i } - Testing converted ${ game.fields.entryTitle[LOCALE] } to engage on LIVE`);
                    } else {
                        if (!releaseToProd) {
                            game.fields.vendor[LOCALE] = 'infinity';
                            game.update();

                            console.log(`[${ new Date().toLocaleTimeString() }] #${ i } - Converted ${ game.fields.entryTitle[LOCALE] } to infinity on staging`);
                        } else {
                            game.publish();

                            console.log(`[${ new Date().toLocaleTimeString() }] #${ i } - Published ${ game.fields.entryTitle[LOCALE] } to infinity on LIVE`);
                        }
                    }
                } catch (e) {
                    console.error(e);
                }    
            }, i * 400);
        });
        
    } catch (e) {
        console.error(e);
    }
});

module.exports = script;
