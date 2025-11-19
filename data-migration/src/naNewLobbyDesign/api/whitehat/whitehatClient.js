import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

import { DEFAULT_WHITEHAT_ENV } from './constants';

// Create a dedicated axios instance for whitehat API calls with rate limiting
const whitehatAxios = axios.create({
    timeout: 30000, // 30 second timeout
});

// Simple rate limiter using axios interceptors
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // 100ms between requests

whitehatAxios.interceptors.request.use(async (config) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        const delayTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, delayTime));
    }
    
    lastRequestTime = Date.now();
    return config;
});

const STATIC_PARAMS = {
    blockUnfunded: false,
    onlyPopular: false,
    testMode: true,
    country: 'US',
    language: 'en-US',
};

/**
 * Returns the appropriate base URL based on country and environment.
 *
 * @param {'US'|'CAON'} country - The country code.
 * @param {'production'|'staging'} [whitehatEnv='production'] - The deployment environment.
 * @returns {string} - The base API URL.
 * @throws {Error} If the country or environment is unsupported.
 */
export function getBaseUrl(country, whitehatEnv = DEFAULT_WHITEHAT_ENV) {
    // Destructure once for clarity
    const { WHITEHAT_NA_API, WHITEHAT_CAON_API, WHITEHAT_STG_API } = process.env;

    const API_BASE_URLS = {
        production: {
            US: WHITEHAT_NA_API,
            CAON: WHITEHAT_CAON_API,
        },
        staging: {
            US: WHITEHAT_STG_API,
            CAON: WHITEHAT_STG_API,
        },
    };
    const envUrls = API_BASE_URLS[whitehatEnv];
    if (!envUrls) {
        throw new Error(`Unsupported environment: "${whitehatEnv}". Expected "production" or "staging".`);
    }

    const baseUrl = envUrls[country];
    if (!baseUrl) {
        throw new Error(`Unsupported country: "${country}". Expected "US" or "CAON".`);
    }

    return baseUrl;
}


/**
 * Fetches data from the Whitehat API.
 * Merges static query parameters with the provided dynamic ones.
 * @param {Object} dynamicParams - Dynamic query parameters (e.g.,
 *                                 { country: 'US', language: 'en-US', brandId: 163, jurisdiction: 'US-RI' }).
 * @param {'US'|'CAON'} [country='US'] - The country code.
 * @param {'production'|'staging'} [whitehatEnv='production'] - The deployment environment.
 * @returns {Promise<Object>} - The response data.
 */
export const getData = async (dynamicParams = {}, country = 'US', whitehatEnv = DEFAULT_WHITEHAT_ENV) => {
    const baseUrl = getBaseUrl(country, whitehatEnv);

    // Merge static and dynamic query parameters.
    const queryParams = { ...STATIC_PARAMS, ...dynamicParams };
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${baseUrl}?${queryString}`;
    console.log('22222', url);


    try {
        const response = await whitehatAxios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Whitehat API:', error.message);
        throw error;
    }
}

/**
 * Fetches game details from the Whitehat API for a specific game.
 * @param {string} launchCode - The launch code of the game to fetch details for.
 * @param {'US'|'CAON'} [country='US'] - The country code.
 * @param {'production'|'staging'} [whitehatEnv='production'] - The deployment environment.
 * @returns {Promise<Object>} - The game details response data.
 */
export const getGameDetails = async (launchCode, country = 'US', whitehatEnv = DEFAULT_WHITEHAT_ENV) => {
    const baseUrl = getBaseUrl(country, whitehatEnv);
    const url = `${baseUrl}/details/${launchCode}`;
    
    console.log('Fetching game details:', url);

    try {
        const response = await whitehatAxios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching game details for ${launchCode}:`, error.message);
        throw error;
    }
}
