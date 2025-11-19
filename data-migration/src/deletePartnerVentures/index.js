import removePartnerVentures from './removePartnerVentures.js';

export default ({ accessToken, env, spaceID, ventureToRemove }) => {
    removePartnerVentures(accessToken, env, spaceID, ventureToRemove);
};
