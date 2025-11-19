import fetchAndTransformEntries from './fetch-and-transform-data.js';
import updateSiteGames from './update-site-game-script.js';
const getProviderGames =async() => {
    await fetchAndTransformEntries();
    await updateSiteGames();
}

export default getProviderGames;
