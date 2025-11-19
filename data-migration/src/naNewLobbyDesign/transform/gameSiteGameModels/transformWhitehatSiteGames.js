import { filterOuPreviousMigrations } from './extract';
import { prepareSiteGameRecords } from './prepareSiteGame';
import { log } from "../../utils/logging";

export const transformSiteGames = async (spaceLocale) => {
    log('Clearing out already migrated records...');
    filterOuPreviousMigrations();
    log('Preparing siteGameV2 entries...');
    await prepareSiteGameRecords(spaceLocale);
}
