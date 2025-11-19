import fs from 'node:fs';
import path from 'node:path';
import { log } from "../../utils/logging";
import { WHITEHAT_MERGED_OUT_PATH, GAMES_SITE_GAMES_MIGRATION_PATH,
    WHITEHAT_ALL_GAMES_FILE_NAME,
    WHITEHAT_SITE_GAME_FILE_NAME,
    WHITEHAT_GAME_FILE_NAME,
    PREVIOUS_MIGRATIONS_FILE_NAME
} from '../../api/whitehat/constants';

export const filterOuPreviousMigrations = () => {
    const siteGamesFilePath = path.join(WHITEHAT_MERGED_OUT_PATH, WHITEHAT_ALL_GAMES_FILE_NAME);
    const previouslyMigratedGamesPath = path.join(GAMES_SITE_GAMES_MIGRATION_PATH, PREVIOUS_MIGRATIONS_FILE_NAME);

    // Check that the whitehat game file exists.
    if (!fs.existsSync(siteGamesFilePath)) {
        console.error(`File not found: ${siteGamesFilePath}`);
        return;
    }
    const siteGamesData = JSON.parse(fs.readFileSync(siteGamesFilePath, 'utf8'));

    // If the previously migrated file doesn't exist, assume an empty array (fresh migration)
    let existingMigratedKeys = [];
    if (fs.existsSync(previouslyMigratedGamesPath)) {
        existingMigratedKeys = JSON.parse(fs.readFileSync(previouslyMigratedGamesPath, 'utf8'));
    } else {
        log(`Previously migrated file not found at ${previouslyMigratedGamesPath}. Assuming fresh migration.`);
    }

    // Filter out records whose uniqueGameVentureKey is found in existingMigratedKeys.
    const filteredGames = siteGamesData.filter(record => {
        return !existingMigratedKeys.includes(record.uniqueGameVentureKey);
    });

    // Write the filtered records to whitehatSiteGameEntries.json.
    const outputFilePath = path.join(WHITEHAT_MERGED_OUT_PATH, WHITEHAT_SITE_GAME_FILE_NAME);
    fs.writeFileSync(outputFilePath, JSON.stringify(filteredGames, null, 2));

    log(`Filtered out ${siteGamesData.length - filteredGames.length} migrated record(s).`);
    log(`Remaining ${filteredGames.length} records written to ${outputFilePath}`);
};

export const extractGameEntries = () => {
    const whitehatSiteGames = `${WHITEHAT_MERGED_OUT_PATH}/${WHITEHAT_SITE_GAME_FILE_NAME}`;
    // 1) Read the entire JSON array
    const data = JSON.parse(fs.readFileSync(whitehatSiteGames, 'utf8'));

    const uniqueRecords = [];
    const seen = new Set();

    // 2) Iterate over each record and sanitize launchCode before checking uniqueness
    for (const item of data) {
        let code = item.game.launchCode;
        code = code
            .replace(/[^\x20-\x7E]+/g, '') // remove non-printable ASCII
            .trim()
            .normalize('NFC');
        if (!seen.has(code)) {
            seen.add(code);
            uniqueRecords.push(item);
        }
    }

    const games = uniqueRecords.map(item => item.game);

    // 4) Write the unique records to whitehatGameEntries.json in the output directory
    const outputJsonPath = path.join(WHITEHAT_MERGED_OUT_PATH, WHITEHAT_GAME_FILE_NAME);
    fs.writeFileSync(outputJsonPath, JSON.stringify(games, null, 2));
    
    log(`Unique game entries written to: ${outputJsonPath}`);
    log(`Found ${uniqueRecords.length} unique records and added ${games.length} games records.`);
}
