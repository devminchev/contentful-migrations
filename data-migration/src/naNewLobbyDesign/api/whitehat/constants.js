export const JSON_PATH="output/whitehatGamesAllBrands.json";
export const ALLOWED_BRAND_IDS=[151,139,153,163];
export const MERGE_INPUT_FOLDER_PATH="output/whitehatGameData";
export const DEFAULT_WHITEHAT_ENV = 'production';

export const BRAND_MAPPINGS = [
    { brand: '139', jurisdiction: 'US-NJ', siteName: 'ballybetnj' },
    { brand: '139', jurisdiction: 'US-PA', siteName: 'ballybetpa' },
    { brand: '139', jurisdiction: 'US-RI', siteName: 'ballybetri' },
    { brand: '153', jurisdiction: 'CA-ON', siteName: 'ballybeton' },
    { brand: '151', jurisdiction: 'US-NJ', siteName: 'monopolycasinonj' },
    { brand: '163', jurisdiction: 'CA-ON', siteName: 'monopolycasinoon' },
    { brand: '151', jurisdiction: 'US-PA', siteName: 'monopolycasinopa' }
];

export const BRAND_REGION_SITENAME_MAP = {
    '139_US-NJ': 'ballybetnj',
    '139_US-PA': 'ballybetpa',
    '139_US-RI': 'ballybetri',
    '153_CA-ON': 'ballybeton',
    '151_US-NJ': 'monopolycasinonj',
    '163_CA-ON': 'monopolycasinoon',
    '151_US-PA': 'monopolycasinopa'
}
// '_PA': 'monopolycasinopa'

export const GAME_TYPE_MAP = {
    'slots': 'Slots',
    'poker': 'Poker',
    'video poker': 'Poker',
    'table': 'Casino',
    'casino': 'Casino',
    'instant': 'Instant Win'
};

export const WHITEHAT_VENDOR = 'whitehat';

export const WHITEHAT_OUT_PATH = "./src/naNewLobbyDesign/data/gameSiteGameModels/whitehat/brandData";
export const WHITEHAT_MERGED_OUT_PATH = "./src/naNewLobbyDesign/data/gameSiteGameModels/whitehat";
export const GAMES_SITE_GAMES_MIGRATION_PATH = "./src/naNewLobbyDesign/data/gameSiteGameModels/na";
export const WHITEHAT_ALL_GAMES_FILE_NAME = 'whitehatGamesAllBrands.json';
export const WHITEHAT_INTERIM_ALL_GAMES_FILE_NAME = 'whitehatInterimAllBrands.json';
export const WHITEHAT_SITE_GAME_FILE_NAME = 'whitehatSiteGameEntries.json';
export const WHITEHAT_GAME_FILE_NAME = 'whitehatGameEntries.json';
export const PREVIOUS_MIGRATIONS_FILE_NAME = 'succesfullyMigratedWhitehatGames.json';
