import { script } from './removeArchivedEntries.js';

export default ({accessToken, env, spaceID}) => {
    script(accessToken, env, spaceID);
};
