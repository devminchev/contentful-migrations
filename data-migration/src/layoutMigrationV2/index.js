import downloadSiteGamesData from './extract/downloadSiteGamesData.js';
import mapV1SiteGameToSiteGame from './transform/createSiteGamesMapping.js';
import transformSection from './transform/transformSectionData.js';
import updateLayout from './load/updateLayout.js';
import { PRODUCTION_SPACE } from './constant.js';

export default async ({ accessToken, env, space }) => {
    const spaceLocale = space === PRODUCTION_SPACE ? 'en-GB' : 'en-US';
    const spaceFolder = space === PRODUCTION_SPACE ? 'production' : 'na';

    console.log(`--------------------------------`)
    console.log(`STARTING EXTRACTION`);
    console.log(`--------------------------------`)
    await downloadSiteGamesData(accessToken, env, space, spaceFolder);

    console.log(`--------------------------------`)
    console.log(`DATA EXTRACTION COMPLETED`);
    console.log(`--------------------------------`)

    console.log(`--------------------------------`)
    console.log(`STARTING SITE_GAME_V1 MAPPING TO SITE_GAME_V2`);
    console.log(`--------------------------------`)
    await mapV1SiteGameToSiteGame(env, spaceLocale, spaceFolder);

    console.log(`--------------------------------`)
    console.log(`TRANSFORMING SECTION MODEL`);
    console.log(`--------------------------------`)
    await transformSection(env, spaceLocale, spaceFolder);

    console.log(`--------------------------------`)
    console.log(`UPDATING SITE_GAME_V2 IN SECTION MODEL`);
    console.log(`--------------------------------`)

    await updateLayout(accessToken, env, space, spaceFolder, spaceLocale);

    console.log(`--------------------------------`)
    console.log(`LAYOUT UPDATE & PUBLISH OPERATION COMPLETED !!!`);
    console.log(`--------------------------------`)
};
