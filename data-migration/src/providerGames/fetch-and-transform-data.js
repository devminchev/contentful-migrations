import contentful from 'contentful-management';

import fs from 'node:fs';
// import { set } from 'lodash';


const SPACE_ID=process.env.SPACE_ID;
const LOCALE=process.env.LOCALE;
const provider=process.env.PROVIDER;
const accessToken=process.env.ACCESS_TOKEN;
const env=process.env.ENV;
const jurisdiction = process.env.JURISDICTION;

const chunkArray = (array, chunkSize) =>
  Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, index) =>
    array.slice(index * chunkSize, (index + 1) * chunkSize)
  );

const processEntries = async (environment, entryType, field, entryIds, optionalParams={}) => {
  const chunkSize = 50;
  const {key,val} = optionalParams;
  const chunkedArrays = chunkArray(entryIds, chunkSize);
  const data = await Promise.all(
    chunkedArrays.map(async (arr) => {
      const idsForQuery = arr.join(',');
      const entries = await environment.getEntries({
        limit: 1000,
        content_type: entryType,
        [field]: idsForQuery,
        [key]: val,
        'sys.archivedAt[exists]': 'false',
      });
      return entries;
    })
  );
  return data.reduce((acc, curr) => {
    if (curr) {
      acc.push(...curr.items);
    }
    return acc;
  }, []);
};

const fetchAndTransformEntries = async () => {
  const client = contentful.createClient({ accessToken });
  const s = await client.getSpace(SPACE_ID);
  const environment = await s.getEnvironment(env);

  const jurisdictionEntry = await environment.getEntries({
    content_type: 'jurisdiction',
    [`fields.name.${LOCALE}`]: jurisdiction,
    'sys.archivedAt[exists]': 'false'
  });
  const jurisdictionId = jurisdictionEntry.items[0].sys.id;


  const ventures = await environment.getEntries({
    content_type: 'venture',
    [`fields.jurisdiction.${LOCALE}.sys.id`]: jurisdictionId,
    'sys.archivedAt[exists]': 'false'
  });

  const ventureIds = ventures.items.map(venture=>venture.sys.id);


  const providerGamesEntries = await environment.getEntries({
    limit: 1000,
    content_type: 'cashierGameConfig',
    [`fields.gameProvider.${LOCALE}`]: provider,
    
  });

  const providerGamesGameSkinIds = providerGamesEntries.items.map(
    (data) => data.fields.gameSkinName[LOCALE]
  );
  const gameConfigData = await processEntries(
    environment,
    'gameConfig',
    `fields.entryTitle.${LOCALE}[in]`,
    providerGamesGameSkinIds
  );

  const validGameSkins = gameConfigData.map((item) => ({
    gameSkin: item.fields.gameSkin[LOCALE][0],
    gameConfigEntryId: item.sys.id,
  }));
 
  const notFoundGameSkins = providerGamesGameSkinIds.filter(
    (item) => !validGameSkins.some((validItem) => validItem.gameSkin === item)
  );
  console.log('Total gameSkins: ', providerGamesGameSkinIds.length, 'Invalid gameSkins: ', notFoundGameSkins.length);
  
  const gameEntries = await processEntries(
    environment,
    'game',
    `fields.gameConfig.${LOCALE}.sys.id[in]`,
    validGameSkins.map((gs) => gs.gameConfigEntryId)
  );

  const allGameIDsWithGameSkin = gameEntries.map((game) => ({
    gameConfigId: game.fields.gameConfig[LOCALE].sys.id,
    gameId: game.sys.id,
    gameName: game.fields.entryTitle[LOCALE],
  }));
 
  const allGameIDSForQuery = allGameIDsWithGameSkin.map((game) => game.gameId);

  const siteGames = await processEntries(
    environment,
    'siteGame',
    `fields.game.${LOCALE}.sys.id[in]`,
    allGameIDSForQuery,
    {'key':`fields.venture.${LOCALE}.sys.id[in]`, 'val': ventureIds.join(',')}
  );

  const siteGameData = siteGames.map((siteGame) => ({
    gameId: siteGame.fields.game[LOCALE].sys.id,
    siteGameEntryId: siteGame.sys.id,
    siteGameName: siteGame.fields.entryTitle[LOCALE],
  }));

  const finalData = siteGameData.map((data) => {
    const gameData = allGameIDsWithGameSkin.find((d) => d.gameId === data.gameId);
    const gameConfigData = validGameSkins.find(
      (gameConfig) => gameConfig.gameConfigEntryId === gameData.gameConfigId
    );
    return { provider, ...data, ...gameData, ...gameConfigData };
  });

  const jsonString = JSON.stringify(finalData, null, 2);

  fs.writeFileSync(`./src/providerGames/data/${provider}-${jurisdiction}.json`, jsonString);
  console.log('JSON file created successfully.');
};

export default fetchAndTransformEntries;
