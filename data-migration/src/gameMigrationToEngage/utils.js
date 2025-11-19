import { ventures } from './constants.js';

export const mergeEntryResponses = (responses) => {
    let mergedResponses = []
    for (response of responses) {
        if (response.items.length > 0) {
            mergedResponses = mergedResponses.concat(response.items)
        }
    }
    return mergedResponses;
}

export const getVentureFromEntryTitle = (entryTitle) => {
    for (const venture of ventures) {
        if (entryTitle.includes(venture)) {
            return venture;
        }
    }
}

