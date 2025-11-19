import { readFile, writeFile } from 'node:fs/promises';
import { setField } from './setField.js';

const DEFAULT_LOCALE = 'en-GB';

const copyMiniGames = (async (environment, locale, venture, sourceVenture, partner, targetPartner) => {
  try {
    const siteGameIDMap = JSON.parse(await readFile(`${ __dirname }/siteGameIDMap.json`, 'utf-8'));
    const getAllVentureMiniGames = (envvv) => {
      const promises = [];

      for (let i = 0; i < 1; i++) {
        promises.push(envvv.getEntries({
          'content_type': 'miniGames',
          'fields.venture.sys.id': sourceVenture.items[0].sys.id,
          'sys.archivedAt[exists]': false,
          'limit': 1000,
          'skip': i * 1000
        }));
      }

      return Promise.all(promises);
    };

    const allVentureMiniGames = await getAllVentureMiniGames(environment);
    let flatAllVentureMiniGames = [];

    allVentureMiniGames.forEach((batch) => {
      flatAllVentureMiniGames = flatAllVentureMiniGames.concat(batch.items);
    });

    const miniGames = flatAllVentureMiniGames[0];

    console.log(new Date().toLocaleTimeString(), `COPYING MINIGAMES ${ miniGames.fields.entryTitle[DEFAULT_LOCALE] } to ${ partner }`);

    const newMiniGamesFields = {...miniGames.fields};

    setField(newMiniGamesFields, 'entryTitle', DEFAULT_LOCALE,
      miniGames.fields.entryTitle[DEFAULT_LOCALE].replace(venture, partner).replace(' [partner]', ''));
    setField(newMiniGamesFields, 'venture', DEFAULT_LOCALE, { sys: { type: 'link', linkType: 'Entry', id: targetPartner.sys.id } });

    const miniGamesSectionIDMap = {}

    for(let miniGamesSection of miniGames.fields.sections[DEFAULT_LOCALE]) {
      const section = await environment.getEntry(miniGamesSection.sys.id);

      console.log(new Date().toLocaleTimeString(), `COPYING MINI GAMES SECTION ${ section.fields.entryTitle[DEFAULT_LOCALE] } to ${ partner }`);

      const newMiniGamesSectionFields = {...section.fields};

      setField(newMiniGamesSectionFields, 'entryTitle', DEFAULT_LOCALE,
        section.fields.entryTitle[DEFAULT_LOCALE].replace(venture, partner).replace(' [partner]', ''));

      if (section?.fields?.games?.[DEFAULT_LOCALE].length) {
        section.fields.games[DEFAULT_LOCALE].forEach((game, i) => {
          newMiniGamesSectionFields.games[DEFAULT_LOCALE][i].sys.id = siteGameIDMap[section.fields.games[DEFAULT_LOCALE][i].sys.id]
        });
      }

      const newMiniGamesSection = await environment.createEntry('section', {
        fields: newMiniGamesSectionFields
      });
      await newMiniGamesSection.publish();

      miniGamesSectionIDMap[section.sys.id] = newMiniGamesSection.sys.id;
    }

    newMiniGamesFields.sections[DEFAULT_LOCALE].forEach((sec, i) => {
      newMiniGamesFields.sections[DEFAULT_LOCALE][i].sys.id = miniGamesSectionIDMap[newMiniGamesFields.sections[DEFAULT_LOCALE][i].sys.id]
    });

    const newMiniGames = await environment.createEntry('miniGames', {
      fields: newMiniGamesFields
    });
    await newMiniGames.publish();

    // @ts-ignore
    await writeFile(`${ __dirname }/miniGamesSectionIDMap.json`, JSON.stringify(miniGamesSectionIDMap, null, 2), err => { console.error(err) });
  } catch (e) {
   console.error(e)
  }
})

export default copyMiniGames;
