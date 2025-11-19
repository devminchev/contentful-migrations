import removeContentType from './removeContentType.js';

export default ({ accessToken, env, spaceID, model, removeModel }) => {
    removeContentType(accessToken, env, spaceID, model, removeModel);
};
