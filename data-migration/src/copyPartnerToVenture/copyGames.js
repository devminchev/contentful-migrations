import { writeFile } from 'node:fs/promises';
import { setField } from './setField.js';

const DEFAULT_LOCALE = 'en-GB';

const copyGames = (async (environment, locale, venture, sourceVenture, partner, targetPartner) => {
  try {
    const getAllVentureGames = (envvv) => {
      const promises = [];

      for (let i = 0; i < 2; i++) {
        promises.push(envvv.getEntries({
          'content_type': 'game',
          'fields.venture.sys.id': sourceVenture.items[0].sys.id,
          'sys.archivedAt[exists]': false,
          'limit': 1000,
          'skip': i * 1000
        }));
      }

      return Promise.all(promises);
    };

    const allVentureGames = await getAllVentureGames(environment);
    let flatAllVentureGames = [];

    allVentureGames.forEach((batch) => {
      flatAllVentureGames = flatAllVentureGames.concat(batch.items);
    });

    const gameIDMap = {}

    for(let game of flatAllVentureGames) {
      console.log(new Date().toLocaleTimeString(), `COPYING GAME ${ game.fields.entryTitle[DEFAULT_LOCALE] } to ${ partner }`);

      if (game?.fields?.gameConfig?.[DEFAULT_LOCALE]?.sys?.id && game?.fields?.gameInfo?.[locale]?.sys?.id) {
        const gameConfig = await environment.getEntry(game.fields.gameConfig[DEFAULT_LOCALE].sys.id);
        const gameInfo = await environment.getEntry(game.fields.gameInfo[locale].sys.id);

        const newGameInfoFields = {...gameInfo.fields};

        setField(newGameInfoFields, 'entryTitle', DEFAULT_LOCALE, gameInfo.fields.entryTitle[DEFAULT_LOCALE].replace(venture, partner));

        const newGameInfo = await environment.createEntry('gameInfo', {
          fields: newGameInfoFields
        });
        await newGameInfo.publish();


        const newGameFields = {...game.fields};

        setField(newGameFields, 'entryTitle', DEFAULT_LOCALE, game.fields.entryTitle[DEFAULT_LOCALE].replace(venture, partner));
        setField(newGameFields, 'venture', DEFAULT_LOCALE, { sys: { type: 'link', linkType: 'Entry', id: targetPartner.sys.id } });
        setField(newGameFields, 'gameInfo', locale, { sys: { type: 'link', linkType: 'Entry', id: newGameInfo.sys.id } });

        const newGame = await environment.createEntry('game', {
          fields: newGameFields
        });
        await newGame.publish();
        gameIDMap[game.sys.id] = newGame.sys.id;
      } else {
        console.log(new Date().toLocaleTimeString(), 'SKIPPING', game.fields.entryTitle[DEFAULT_LOCALE]);
      }
    }

    // @ts-ignore
    await writeFile(`${ __dirname }/gameIDMap.json`, JSON.stringify(gameIDMap, null, 2), err => { console.error(err) });
  } catch (e) {
   console.error(e)
  }
})

export default copyGames;
