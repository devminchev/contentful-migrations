import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { GAMES_SITE_GAMES_MIGRATION_PATH, PREVIOUS_MIGRATIONS_FILE_NAME } from './constants';

const PREVIOUS_WHITEHAT_MIGRATED_RECORDS = `${GAMES_SITE_GAMES_MIGRATION_PATH}/${PREVIOUS_MIGRATIONS_FILE_NAME}`;

export const checkIfPreviousMigrations = () => {
    let prevSuccessfullyMigratedGames = [];

    if (existsSync(PREVIOUS_WHITEHAT_MIGRATED_RECORDS)) {
        prevSuccessfullyMigratedGames = JSON.parse(readFileSync(PREVIOUS_WHITEHAT_MIGRATED_RECORDS, 'utf8')) || [];
    } else {
        console.log('Fresh migration: succesfullyMigratedGames file not found.');
    }
    return prevSuccessfullyMigratedGames;
}

export const storeSuccessfulMigration = (successfullyMigratedGames = []) => {
    writeFileSync(
        PREVIOUS_WHITEHAT_MIGRATED_RECORDS,
        JSON.stringify(successfullyMigratedGames)
    );
}
