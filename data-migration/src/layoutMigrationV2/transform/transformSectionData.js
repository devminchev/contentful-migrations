import { writeFile, readFile } from 'node:fs/promises';
import { CONTENT_TYPES_V2, CONTENT_TYPES, SECTION } from "../constant.js";


const getV2GameDataFromMapping = async (siteGameV1MappedData, sectionSiteGame) => {
    const siteGameV2 = [];

    try {
        for (sg of sectionSiteGame) {
            if (!sg) continue

            const data = siteGameV1MappedData.find((entry) => entry.v1SiteGameId === sg.sys.id);
            if (data?.v2SiteGameId) {
                sg.sys.id = data.v2SiteGameId;
                siteGameV2.push(sg)
            }


        }
    } catch (error) {
        console.log(error)
    }

    return siteGameV2 || null;
}

const transformSection = async (env, spaceLocale, spaceFolder) => {
    const contentType = CONTENT_TYPES[0];
    const contentTypeV2 = CONTENT_TYPES_V2[0];
    const sections = JSON.parse(await readFile(`./src/layoutMigrationV2/data/${spaceFolder}/${SECTION}.json`, 'utf-8'));
    const siteGameV1MappedData = JSON.parse(await readFile(`./src/layoutMigrationV2/data/${spaceFolder}/${contentType}-${contentTypeV2}-mapping.json`, 'utf-8'));
    const updatedSection = [];
    const updatedNoGamesSection = [];

    console.log('Total Number of All Sections : ', sections.entries.length);
    for (let i = 0; i < sections.entries.length; i++) {
        const sec = sections.entries[i];

        if (!sec.fields.games) {
            updatedNoGamesSection.push({ id: sec.sys.id, name: sec.fields.entryTitle[spaceLocale] });

            continue;
        }
        const sectionSiteGame = sec?.fields?.games[spaceLocale];
        updatedSection.push({
            id: sec.sys.id, name: sec.fields.entryTitle[spaceLocale],
            gamesV2: { [spaceLocale]: await getV2GameDataFromMapping(siteGameV1MappedData, sectionSiteGame) }
        });

    }
    await writeFile(`./src/layoutMigrationV2/data/${spaceFolder}/${SECTION}-updated.json`, JSON.stringify(
        updatedSection
    ));

    await writeFile(`./src/layoutMigrationV2/data/${spaceFolder}/${SECTION}-no-games.json`, JSON.stringify(
        updatedNoGamesSection
    ));
}

export default transformSection;
