import transformGames from "../../gameModelV2/transform/transformGames.js";
import { SITE_GAME, SITE_GAME_V2 } from "../constant.js";
import { writeFile, readFile } from 'node:fs/promises';

const matchSiteGameNames = (v1Name, v2Name) => {
    if (!v1Name || !v2Name) return false;
    // console.log(v1Name.replace(/[^A-Z0-9]+/ig,'') , v2Name.replace(/[^A-Z0-9]+/ig,''))
    // return v1Name.replace(/[^A-Z0-9]+/ig,'') === v2Name.replace(/[^A-Z0-9]+/ig,'');
    return v1Name === v2Name;
}
function sleep(ms) {
    console.log(`Wait for ${ms / 1000} sec`)
    return new Promise(resolve => setTimeout(resolve, ms));
}

const mapV1SiteGameToSiteGame = async (env, spaceLocale, spaceFolder) => {

    const siteGameV1 = JSON.parse(await readFile(`./src/layoutMigrationV2/data/${spaceFolder}/${SITE_GAME}.json`, 'utf-8'));
    const siteGameV2 = JSON.parse(await readFile(`./src/layoutMigrationV2/data/${spaceFolder}/${SITE_GAME_V2}.json`, 'utf-8'));

    const siteGameV1ToV2IdMap = [];
    const missingMapping = []

    for (sitegame of siteGameV1.entries) {
        const oldSiteGameId = sitegame.sys.id;
        const oldSiteGameName = sitegame.fields.entryTitle[spaceLocale];
        const siteGameV2Obj = siteGameV2.entries.find((siteGame) => matchSiteGameNames(oldSiteGameName, siteGame.fields.entryTitle[spaceLocale]));
        if (siteGameV2Obj) {
            siteGameV1ToV2IdMap.push({
                'v1SiteGameId': oldSiteGameId,
                v2SiteGameId: siteGameV2Obj.sys.id,
                v1SiteGameEntryTitle: oldSiteGameName,
                v2SiteGameEntryTitle: siteGameV2Obj.fields.entryTitle[spaceLocale]
            })
        } else {
            missingMapping.push({
                'v1SiteGameId': oldSiteGameId,
                v2SiteGameId: null,
                v1SiteGameEntryTitle: oldSiteGameName,
                v2SiteGameEntryTitle: null
            })
        }
    }
    await writeFile(`./src/layoutMigrationV2/data/${spaceFolder}/${SITE_GAME}-${SITE_GAME_V2}-mapping.json`, JSON.stringify(
        siteGameV1ToV2IdMap
    ));
    await writeFile(`./src/layoutMigrationV2/data/${spaceFolder}/${SITE_GAME}-${SITE_GAME_V2}-missing-data.json`, JSON.stringify(
        missingMapping
    ));
    console.log('\n*************************')
    console.log('number of entries in SITE_GAME =>', siteGameV1.entries.length, 'number of entries in SITE_GAME_V2 =>', siteGameV2.entries.length);
    console.log('number of entries of SITE_GAME matching SITE_GAME_V2 =>', siteGameV1ToV2IdMap.length);
    console.log('number of entries of SITE_GAME missing SITE_GAME_V2 =>', missingMapping.length);
    console.log('\n*************************')

    await sleep(30000);

}

export default mapV1SiteGameToSiteGame;

