import { readFile, writeFile } from 'node:fs/promises';
import { setField } from './setField.js';

const DEFAULT_LOCALE = 'en-GB';

const getAllVentureSiteGames = (envvv) => {
  const promises = [];

  for (let i = 0; i < 2; i++) {
    promises.push(envvv.getEntries({
      'content_type': 'siteGame',
      'fields.venture.sys.id': sourceVenture.items[0].sys.id,
      'sys.archivedAt[exists]': false,
      'limit': 1000,
      'skip': i * 1000
    }));
  }

  return Promise.all(promises);
};

const copySiteGames = (async (environment, locale, venture, sourceVenture, partner, targetPartner) => {
  try {
    const gameIDMap = JSON.parse(await readFile(`${__dirname}/gameIDMap.json`, 'utf-8'));

    const allVentureSiteGames = await getAllVentureSiteGames(environment);
    let flatAllVentureSiteGames = [];

    allVentureSiteGames.forEach((batch) => {
      flatAllVentureSiteGames = flatAllVentureSiteGames.concat(batch.items);
    });

    const siteGameIDMap = {}

    for (let game of flatAllVentureSiteGames) {
      console.log(new Date().toLocaleTimeString(), `COPYING SITE GAME ${game.fields.entryTitle[DEFAULT_LOCALE]} to ${partner}`);

      if (game.fields?.game?.[DEFAULT_LOCALE]?.sys?.id) {
        const newSiteGameFields = { ...game.fields };

        setField(newSiteGameFields, 'entryTitle', DEFAULT_LOCALE, game.fields.entryTitle[DEFAULT_LOCALE].replace(venture, partner));
        setField(newSiteGameFields, 'venture', DEFAULT_LOCALE, { sys: { type: 'link', linkType: 'Entry', id: targetPartner.sys.id } });
        setField(newSiteGameFields, 'game', DEFAULT_LOCALE, { sys: { type: 'link', linkType: 'Entry', id: gameIDMap[newSiteGameFields.game[DEFAULT_LOCALE].sys.id] } });

        const newSiteGame = await environment.createEntry('siteGame', {
          fields: newSiteGameFields
        });
        await newSiteGame.publish();

        siteGameIDMap[game.sys.id] = newSiteGame.sys.id;
      } else {
        console.log(new Date().toLocaleTimeString(), 'SKIPPING', game.fields.entryTitle[DEFAULT_LOCALE]);
      }
    }

    // @ts-ignore
    await writeFile(`${__dirname}/siteGameIDMap.json`, JSON.stringify(siteGameIDMap, null, 2), err => { console.error(err) });
  } catch (e) {
    console.error(e)
  }
})

export default copySiteGames;
