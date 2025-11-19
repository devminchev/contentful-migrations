import fs from 'node:fs';
import path from 'node:path';
import { log } from "../../utils/logging";
import { getData } from './whitehatClient';
import { WHITEHAT_OUT_PATH, WHITEHAT_MERGED_OUT_PATH, WHITEHAT_ALL_GAMES_FILE_NAME, WHITEHAT_INTERIM_ALL_GAMES_FILE_NAME, BRAND_MAPPINGS, BRAND_REGION_SITENAME_MAP, ALLOWED_BRAND_IDS, DEFAULT_WHITEHAT_ENV } from './constants';

export const getWhitehatGames = async () => {
    const environments = ['production', 'staging'];

    try {
        await getGamesByBrand(environments);
        log(`Merging data for all brands`);
        await mergeJsonFiles();
        processMerged();
    } catch (error) {
        console.error(`Error merging data for Whitehat:`, error);
    }
}

/**
 * Fetches and stores game data for all brands in all specified environments.
 *
 * @param {'prod'|'stg'}[] [environments=['prod','stg']] - List of Whitehat environments to process.
 */
export async function getGamesByBrand(environments = ['production', 'staging']) {
    for (const env of environments) {
        for (const { brand, jurisdiction } of BRAND_MAPPINGS) {
            const tag = `${brand}_${jurisdiction} [${env}]`;
            log(`Fetching data for ${tag}`);

            try {
                const games = await getGameData(brand, jurisdiction, env);
                log(`Storing data for ${tag} (got ${games.length} games)`);
                await storeGameData(brand, jurisdiction, games, env);
            } catch (error) {
                console.error(`❌ Error processing ${tag}:`, error);
            }
        }
    }
}


/**
 * Fetch game data from the API for a given brand and jurisdiction.
 * Determines the country param based on the jurisdiction.
 *
 * @param {string} brand - The brand ID (e.g., '139').
 * @param {string} jurisdiction - The jurisdiction (e.g., 'US-NJ' or 'CA-ON').
 * @returns {Promise<Object>} - The data returned by the API.
 */
const getGameData = async (brand, jurisdiction, whitehatEnv = DEFAULT_WHITEHAT_ENV) => {
    const country = jurisdiction === 'CA-ON' ? 'CAON' : 'US';
    const dynamicParams = {
        brandId: parseInt(brand, 10),
        jurisdiction
    };

    const data = await getData(dynamicParams, country, whitehatEnv);
    return data;
};

/**
 * Stores game data in a file.
 * The filename follows the pattern: {brand}-{jurisdiction}.json (all lower-case)
 *
 * @param {string} brand - The brand ID.
 * @param {string} jurisdiction - The jurisdiction.
 * @param {Object} data - The game data to store.
 */
const storeGameData = async (brand, jurisdiction, data, whitehatEnv = DEFAULT_WHITEHAT_ENV) => {
    const fileName = `${brand}_${jurisdiction.toLowerCase()}_${whitehatEnv}.json`;
    const outputPath = path.join(WHITEHAT_OUT_PATH, fileName);


    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    log(`Stored data for ${brand} ${jurisdiction} at ${outputPath}`);
}

/**
 * Merges all .json files in a given folder if their brand ID
 * (extracted from the filename) is in the allowedBrandIds list.
 * Adds `brandID` to each record in the merged output.
 * Logs skipped files (those with brand IDs not in the allowed list).
 *
 * The final merged file is always written to output/whitehatGamesAllBrands.json
 *
 * @param {string} folderPath - Path to the folder containing .json files.
 */
const mergeJsonFiles = () => {
    const outputJsonPath = path.join(
        WHITEHAT_MERGED_OUT_PATH,
        WHITEHAT_INTERIM_ALL_GAMES_FILE_NAME
    );

    const skippedFiles = [];
    const merged = [];

    // 3) Read all .json files in the folder
    const files = fs
        .readdirSync(WHITEHAT_OUT_PATH)
        .filter(file => file.toLowerCase().endsWith('.json'));

    // 4) Iterate each file
    for (const file of files) {
        // now matching "139_us_prod.json" → ["139_us_prod.json","139","us","prod"]
        const match = file.match(/^(\d+)_([^_]+)_([^_]+)\.json$/);
        if (!match) {
            skippedFiles.push(file);
            continue;
        }

        const brandId = parseInt(match[1], 10);
        const whitehatEnv = match[3]; // e.g. "prod" or "stg"

        if (!ALLOWED_BRAND_IDS.includes(brandId)) {
            // Not in allowedBrandIds => skip
            skippedFiles.push(file);
            continue;
        }

        // 5) Read and parse JSON
        const filePath = path.join(WHITEHAT_OUT_PATH, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // 6) Inject brandID, env, and publishedStatus
        data.forEach(record => {
            record.game = record.game || {};

            const sections = record.categories?.map(c => c.id);
            const { launchCode, isTestOnlyMode = false, ...restGame } = record.game;
            const jurisdiction = record.jurisdictions || '';
            const venture = BRAND_REGION_SITENAME_MAP[`${brandId}_${jurisdiction}`] || '';
            const uniqueGameVentureKey = `${brandId}_${jurisdiction}_${launchCode}`;
            const gamePublishedStatus = isTestOnlyMode ? 'draft' : 'published';

            // also top‑level props
            record.whitehatEnv = [whitehatEnv];
            record.publishedStatus = gamePublishedStatus;

            // rebuild record.game with brandID, env, and status
            record.game = {
                launchCode,
                brandID: brandId,
                whitehatEnv: [whitehatEnv],
                publishedStatus: gamePublishedStatus,
                ...restGame,
            };


            merged.push({
                venture,
                uniqueGameVentureKey,
                ...record,
                categories: sections,
            });
        });
    }

    // 7) Write merged output
    fs.writeFileSync(outputJsonPath, JSON.stringify(merged, null, 2));
    log(`Merged JSON ⇒ ${outputJsonPath}`);

    // 8) Log skipped files
    if (skippedFiles.length) {
        log('\nSkipped files (invalid format or brand ID):');
        skippedFiles.forEach(f => log(` - ${f}`));
    } else {
        log('\nNo files skipped.');
    }
};

/**
 * Processes merged game entries to handle duplicates based on uniqueGameVentureKey.
 * - Logs counts
 * - Handles merging of entries with logic based on whitehatEnv and publishedStatus
 * - Writes final entries and logs complex duplicates
 */
export function processMerged() {
    const interimPath = path.join(
        WHITEHAT_MERGED_OUT_PATH,
        WHITEHAT_INTERIM_ALL_GAMES_FILE_NAME
    );
    const outputPath = path.join(
        WHITEHAT_MERGED_OUT_PATH,
        WHITEHAT_ALL_GAMES_FILE_NAME
    );
    const duplicatesPath = path.join(
        WHITEHAT_MERGED_OUT_PATH,
        'Duplicates.json'
    );

    const raw = fs.readFileSync(interimPath, 'utf8');
    const allRecords = JSON.parse(raw);
    log(`Total records before processing: ${allRecords.length}`);

    const groups = allRecords.reduce((acc, rec) => {
        const key = rec.uniqueGameVentureKey;
        if (!acc[key]) acc[key] = [];
        acc[key].push(rec);
        return acc;
    }, {});

    const finalEntries = [];
    const duplicateEntries = [];
    let complexDuplicateCount = 0;

    Object.entries(groups).forEach(([key, records]) => {
        if (records.length === 1) {
            finalEntries.push(records[0]);
            return;
        }
        const allEnvs = Array.from(new Set(records.flatMap(r => r.whitehatEnv)));
        const allStatuses = Array.from(new Set(records.map(r => r.publishedStatus)));

        if (allEnvs.length > 1 && allStatuses.length === 1) {
            const merged = { ...records[0] };
            merged.whitehatEnv = allEnvs;
            merged.game.whitehatEnv = allEnvs;
            finalEntries.push(merged);
        } else if (allEnvs.length > 1 && allStatuses.length > 1) {
            complexDuplicateCount++;
            duplicateEntries.push(...records);

            const hasDraft = records.some(r => r.publishedStatus === 'draft');
            const merged = { ...records[0] };
            merged.whitehatEnv = ['staging'];
            merged.game.whitehatEnv = ['staging'];
            merged.publishedStatus = hasDraft ? 'draft' : 'published';
            merged.game.publishedStatus = hasDraft ? 'draft' : 'published';

            finalEntries.push(merged);
        } else {
            finalEntries.push(...records);
        }
    });

    log(`Final records after processing: ${finalEntries.length}`);
    log(`Total duplicate keys: ${Object.values(groups).filter(r => r.length > 1).length}`);
    log(`Complex duplicates with different env & status: ${complexDuplicateCount}`);

    fs.writeFileSync(outputPath, JSON.stringify(finalEntries, null, 2));
    log(`Processed merged entries ⇒ ${outputPath}`);

    if (duplicateEntries.length) {
        fs.writeFileSync(duplicatesPath, JSON.stringify(duplicateEntries, null, 2));
        log(`Logged duplicates ⇒ ${duplicatesPath}`);
    } else {
        log('No complex duplicates found.');
    }
}
/*
Function to process the mergedBrands and deal with duplicates.
log how many records we have overall
if we find multiple records with `uniqueGameVentureKey`:
    -> log how many duplicate records are found
    -> get the `record.whitehatEnv` and record.publishedStatus for each of the matching records.
    -> if `record.whitehatEnv` is different for each record AND record.publishedStatus is the same for each record
        -> make a single record out of the multiple ones, but merge the record.whitehatEnv of all of them into the new one. SO if 1 records had ['prod'] and one had ['stg'] the final record should have ['prod', 'stg']. 
    -> if `record.whitehatEnv` is different for each record AND record.publishedStatus is different for each record
        -> log how many with this case we have and store them in `Duplicates.json` file.
        -> if ANY of the duplicates has a 'draft` value for the `record.publishedStatus` property, merge all records into one, setting the value for `record.publishedStatus` to `draft` and setting the `record.whitehatEnv` to 'stg`.
        -> if none of the duplicates has a 'draft' value for the `record.publishedStatus` property, merge all records into one, setting the value for `record.publishedStatus` to `published` and setting the `record.whitehatEnv` to 'stg`.
    -> store the records in a file whitehatGameEntries.json
-> for all non duplcate records store them in the same whitehatGameEntries.json file.
*/


