const contentful = require('contentful-management');
const { includedGames } = require('./includedGames');

const script = (async ({ accessToken, env }) => {
    const client = contentful.createClient({ accessToken });
    const SPACE_ID = 'nw2595tc1jdx';
    const LOCALE = 'en-GB';

    const publish = false;
    console.log(new Date());
    try {
        const space = await client.getSpace(SPACE_ID);
        const environment = await space.getEnvironment(env);
        let vendor = publish ? 'infinity' : 'engage';

        const getAllGamesysGames = (environment) => {
            const promises = [];

            for (let i = 0; i < 10; i++) {
                promises.push(environment.getEntries({
                    'content_type': 'gameV2',
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

        // Provided list to match game by entryTitle
        // flatAllGamesysGames = flatAllGamesysGames.filter(game => includedGames.includes(game.fields.entryTitle[LOCALE]));
        // Provided list to match pattern with name field
        // flatAllGamesysGames = flatAllGamesysGames.filter(game => includedGames.some(element => game.fields.name[LOCALE].includes(element)));
        // Provided list to match pattern with gameLoaderFileName
        //flatAllGamesysGames = flatAllGamesysGames.filter(game => includedGames.some(element => game.fields.gamePlatformConfig[LOCALE].gameLoaderFileName.startsWith(element)));
        flatAllGamesysGames = flatAllGamesysGames.filter(game => includedGames.some(element => game.fields.entryTitle[LOCALE].startsWith(element)));

        console.log(`GAMES FROM INCLUDE LIST: ${ flatAllGamesysGames.length }`);


let allGamesNames = [];
flatAllGamesysGames.forEach((game,i) => {
allGamesNames.push(game.fields.entryTitle[LOCALE]);
});
allGamesNames.sort();
allGamesNames.forEach((element,i) => {
console.log(`'${ element }',`);
});


        /*
        for (let i=0; i<flatAllGamesysGames.length; i++) {
            const game = flatAllGamesysGames[i];
            await sleep(200);
            await processGame(game, publish, client, LOCALE, environment);
            console.log(`Completed processing game ${ game.fields.entryTitle[LOCALE] }`);
        }*/
        
    } catch (e) {
        console.error(e);
    }
    console.log(new Date());
});

const processGame = (async (game, publish, client, LOCALE, environment) => {

    if (publish) {
        console.log(`Publish mode enabled, publishing all games from ${ game.fields.entryTitle[LOCALE] }`);
        await migrateGames(game, game, publish, client, LOCALE, environment);
        return;
    }
    console.log(`Publish mode disabled, migrating all games from ${ game.fields.entryTitle[LOCALE] }`);

    let targetName = '';
    if (game.fields.entryTitle[LOCALE].includes('_infinity')) {
        return;
    } else if (game.fields.entryTitle[LOCALE].includes('_engage')) {
        targetName = game.fields.entryTitle[LOCALE].replace('_engage','_infinity');
    } else {
        targetName =  game.fields.entryTitle[LOCALE] + '_infinity';
    }
 
    const getTargetCandidates = (environment) => {
        const promises = [];

        for (let i = 0; i < 1; i++) {
            promises.push(environment.getEntries({
                'content_type': 'gameV2',
                'fields.vendor': 'infinity',
                'fields.entryTitle': targetName,
                'sys.archivedAt[exists]': false,
                'limit': 1000,
                'skip': i * 1000
            }));
        }

        return Promise.all(promises);
    }

    const targetGames = await getTargetCandidates(environment);
    let resultTargetGames = [];

    targetGames.forEach((batch) => {
            resultTargetGames = resultTargetGames.concat(batch.items);
    });

    await sleep(200);
    if (resultTargetGames.length>0) {
        const resultGame = resultTargetGames[0];
        console.log(`Found target game ${ resultGame.fields.entryTitle[LOCALE]}`);
        await migrateGames(game, resultGame, publish, client, LOCALE, environment);
    } else {
        console.log(`Not found target game, proceeding to create ${ targetName }`);

        let newGame = structuredClone(game);
        newGame.fields.entryTitle[LOCALE] = targetName;
        newGame.fields.vendor[LOCALE] = 'infinity';

        let entry = await environment.createEntry('gameV2', newGame);
        entry = await entry.publish();

        console.log(`Created and published gameModelV2 for ${entry.fields.entryTitle[LOCALE]}`);
        await migrateGames(game, entry, publish, client, LOCALE, environment);
    }
}) ;

const migrateGames = (async (game, targetGame, publish, client, LOCALE, environment) => {

    let flatSiteGames = [];
    for (let i=0; i<1; i++) {

        let siteGames = await environment.getEntries({
            'content_type': 'siteGameV2',
            'fields.game.sys.id': game.sys.id,
            'sys.archivedAt[exists]': false,
            'limit': 1000,
            'include' : 2,
            'skip': i * 1000
        });

        flatSiteGames = flatSiteGames.concat(siteGames.items);
        //console.log(siteGames);

        await sleep(200);
    }

    console.log(`SiteGames v2 found: ${ flatSiteGames.length } for  ${ game.fields.entryTitle[LOCALE] }`);

    flatSiteGames = flatSiteGames.filter(game => game.fields.entryTitle[LOCALE].match(/virgingames|doublebubblebingo|jackpotjoy|ballyuk|rainbowriches|monopolycasino/g));
    flatSiteGames = flatSiteGames.filter(game => !game.fields.entryTitle[LOCALE].match(/canalbingo|monopolycasinospain|botemania/g));

    for(let i=0; i<flatSiteGames.length; i++) {
        const siteGame = flatSiteGames[i];
        try {
            if (publish) {
                siteGame.publish();
                console.log(`Published SiteGame v2: ${ siteGame.fields.entryTitle[LOCALE] } on ${game.fields.entryTitle[LOCALE]}`);
            } else {
                siteGame.fields.game[LOCALE].sys.id = targetGame.sys.id;
                siteGame.update();
                console.log(`Migrated SiteGame v2: ${ siteGame.fields.entryTitle[LOCALE] } to ${targetGame.fields.entryTitle[LOCALE]}`);
            }

            await sleep(200);
        } catch (e) {
            console.error(e);
        }
    }
});

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = script;
