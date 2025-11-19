import { readFile, writeFile } from 'node:fs/promises';
import {setField} from './setField.js';

const DEFAULT_LOCALE = 'en-GB';

const copyRecommendedGames = (async (environment, locale, venture, sourceVenture, partner, targetPartner) => {
  try {
    const siteGameIDMap = JSON.parse(await readFile(`${ __dirname }/siteGameIDMap.json`, 'utf-8'));
    const getAllRecommendedGames = (envvv) => {
      const promises = [];

      for (let i = 0; i < 1; i++) {
        promises.push(envvv.getEntries({
          'content_type': 'recommendedGames',
          'fields.venture.sys.id': sourceVenture.items[0].sys.id,
          'sys.archivedAt[exists]': false,
          'limit': 1000,
          'skip': i * 1000
        }));
      }

      return Promise.all(promises);
    };

    const allRecommendedGames = await getAllRecommendedGames(environment);
    let flatAllRecommendedGames = [];

    allRecommendedGames.forEach((batch) => {
      flatAllRecommendedGames = flatAllRecommendedGames.concat(batch.items);
    });

    const recommendedGames = flatAllRecommendedGames[0];

    console.log(new Date().toLocaleTimeString(), `COPYING RECOMMENDED GAMES ${ recommendedGames.fields.entryTitle[DEFAULT_LOCALE] } to ${ partner }`);

    const newRecommendedGamesFields = {...recommendedGames.fields};

    setField(newRecommendedGamesFields, 'entryTitle', DEFAULT_LOCALE,
      recommendedGames.fields.entryTitle[DEFAULT_LOCALE].replace(venture, partner).replace(' [partner]', ''));
    setField(newRecommendedGamesFields, 'venture', DEFAULT_LOCALE, { sys: { type: 'link', linkType: 'Entry', id: targetPartner.sys.id } });

    if (recommendedGames?.fields?.games?.[DEFAULT_LOCALE].length) {
      recommendedGames.fields.games[DEFAULT_LOCALE].forEach((game, i) => {
        newRecommendedGamesFields.games[DEFAULT_LOCALE][i].sys.id = siteGameIDMap[newRecommendedGamesFields.games[DEFAULT_LOCALE][i].sys.id]
      });
    }

    const newRecommendedGames = await environment.createEntry('recommendedGames', {
      fields: newRecommendedGamesFields
    });
    await newRecommendedGames.publish();
  } catch (e) {
   console.error(e)
  }
})

export default copyRecommendedGames;
