import { filterOuPreviousMigrations, extractGameEntries } from './extract';
import { prepareGameRecords } from './prepareGame';
import { log } from "../../utils/logging";

export const transformGames = (spaceLocale) => {
    log('Clearing out already migrated records...');
    filterOuPreviousMigrations();
    log('Extracting game entries...');
    extractGameEntries();
    log('Preparing gameV2 entries...');
    prepareGameRecords(spaceLocale);
}
