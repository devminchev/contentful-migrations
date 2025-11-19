import contentful from 'contentful-management';

const script = (async ({ accessToken, env, vendor }) => {
    const client = contentful.createClient({ accessToken });
    const SPACE_ID = '6hs6aj69c5cq';
    const LOCALE = 'en-US';

    try {
        const space = await client.getSpace(SPACE_ID);
        const environment = await space.getEnvironment(env);

        const allNetentGames = await environment.getEntries({
            'content_type': 'siteGame',
            'fields.vendor': vendor,
            'sys.archivedAt[exists]': false,
            'limit': 1000
        });

        for (let i = 0; i < allNetentGames.items.length; i++) {
            const allSectionsThatContainGame = await environment.getEntries({
                'content_type': 'section',
                'fields.games.sys.id[in]': allNetentGames.items[i].sys.id,
                'sys.archivedAt[exists]': false,
                'limit': 1000
            });

            for (let j = 0; j < allSectionsThatContainGame.items.length; j++) {
                console.log('DETACTHING', allNetentGames.items[i].fields.entryTitle[LOCALE], 'FROM', allSectionsThatContainGame.items[j].fields.entryTitle[LOCALE]);

                const filteredOutGames = allSectionsThatContainGame.items[j].fields.games[LOCALE].filter((game) => {
                    return game.sys.id !== allNetentGames.items[i].sys.id;
                });

                allSectionsThatContainGame.items[j].fields.games[LOCALE] = filteredOutGames;

                const updatedSection = await allSectionsThatContainGame.items[j].update();
                await updatedSection.publish();                    
            }

            const internalGame = await environment.getEntries({
                'content_type': 'game',
                'sys.id': allNetentGames.items[i].fields.game[LOCALE].sys.id
            });
            const internalGameConfig = await environment.getEntries({
                'content_type': 'gameConfig',
                'sys.id': internalGame.items[0].fields.gameConfig[LOCALE].sys.id
            });
            const internalGameInfo = await environment.getEntries({
                'content_type': 'gameInfo',
                'sys.id': internalGame.items[0].fields.gameInfo[LOCALE].sys.id
            });

            console.log('ARCHIVING GAME CONFIG', internalGameConfig.items[0].fields.entryTitle[LOCALE]);
            if (internalGameConfig.items[0].isPublished()) {
                await internalGameConfig.items[0].unpublish();
            }
            if (!internalGameConfig.items[0].isArchived()) {
                await internalGameConfig.items[0].archive();
            }
            console.log('ARCHIVING GAME INFO', internalGameInfo.items[0].fields.entryTitle[LOCALE]);
            if (internalGameInfo.items[0].isPublished()) {
                await internalGameInfo.items[0].unpublish();
            }
            if (!internalGameInfo.items[0].isArchived()) {
                await internalGameInfo.items[0].archive();
            }

            console.log('ARCHIVING GAME', internalGame.items[0].fields.entryTitle[LOCALE]);
            if (internalGame.items[0].isPublished()) {
                await internalGame.items[0].unpublish();
            }
            if (!internalGame.items[0].isArchived()) {
                await internalGame.items[0].archive();
            }

            console.log('ARCHIVING SITE GAME', allNetentGames.items[i].fields.entryTitle[LOCALE]);
            if (allNetentGames.items[i].isPublished()) {
                await allNetentGames.items[i].unpublish();
            }
            if (!allNetentGames.items[i].isArchived()) {
                await allNetentGames.items[i].archive();
            }
        };

        console.log('ALL DONE');
    } catch (e) {
        console.error(e);
    }
});

export default script;
