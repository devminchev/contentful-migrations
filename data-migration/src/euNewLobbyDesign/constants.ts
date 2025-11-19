const PRODUCTION_SPACE = "nw2595tc1jdx";
const NA_SPACE = "6hs6aj69c5cq";

const SITE_GAME = "siteGame";
const GAME = "game";
const GAME_INFO = "gameInfo";
const GAME_CONFIG = "gameConfig";
const SECTION = "section";
const VENTURE = "venture";

const GAME_V2 = "gameV2";
const SITE_GAME_V2 = "siteGameV2";

const IG_VIEW_MODEL = 'igView';
const LAYOUT_MODEL = 'layout';
const LOBBY_COLLAB_BASED_SECTIONS = "lobbyCollabBasedPersonalisedGamesSection";
const IG_COLLAB_BASED_SECTIONS = 'igCollabBasedPersonalisedSection';
const MINI_GAMES = "miniGames";
const IG_MINI_GAMES = "igMiniGames";
const LOBBY_SUGGESTED_GAMES = "lobbySuggestedGames";
const IG_LOBBY_SUGGESTED_GAMES = "igSuggestedGames"
const SIMILARITY_SECTIONS = "lobbySimilarityBasedPersonalisedGamesSection";
const IG_SIMILARITY_SECTIONS = "igSimilarityBasedPersonalisedSection";
const CATEGORY_MODEL = 'category';
const CATEGORIES_MODEL = 'categories';
const IG_LINK_MODEL = 'igLink';
const IG_NAVIGATION_MODEL = 'igNavigation';
const IG_SECTION_WITHOUT_CAROUSEL = "igGridASection";
const CAROUSEL_A_SECTIONS = "section";
const IG_CAROUSEL_A_SECTIONS = "igCarouselA";
const IG_CAROUSEL_B_SECTIONS = "igCarouselB";
const IG_JACKPOTS_SECTION = 'igJackpotsSection';
const DFG_SECTION = "section";
const IG_DFG_SECTION = "igDfgSection";
const BANNER_SECTION = "section";
const IG_BANNER_SECTION = "igBanner";
const MARKETING_SECTION = "section";
const IG_MARKETING_SECTION = "igMarketingSection";
const EU_JACKPOT_SECTIONS = 'jackpotGamesSection';
const IG_GRID_A_SECTION = "igGridASection";
const IG_GRID_B_SECTION = "igGridBSection";
const IG_GRID_C_SECTION = "igGridCSection";
const IG_GRID_D_SECTION = "igGridDSection";
const IG_GRID_E_SECTION = "igGridESection";
const IG_GRID_F_SECTION = "igGridFSection";
const IG_GRID_G_SECTION = "igGridGSection";
const IG_PROMOTIONS_GRID = 'igPromotionsGrid';
const IG_SEARCH_RESULTS = 'igSearchResults';
const IG_GAME_SHUFFLE_SECTION = 'igGameShuffle';
const IG_BRAZE_PROMO_SECTION = 'igBrazePromosSection';

const CONTENT_TYPES = [
  { name: VENTURE, model: VENTURE, query: [] },
  { name: MINI_GAMES, model: MINI_GAMES, query: [] },
  { name: LOBBY_SUGGESTED_GAMES, model: LOBBY_SUGGESTED_GAMES, query: [] },
  { name: LOBBY_COLLAB_BASED_SECTIONS, model: LOBBY_COLLAB_BASED_SECTIONS, query: [] },
  { name: SIMILARITY_SECTIONS, model: SIMILARITY_SECTIONS, query: [] },
  { name: SECTION, model: SECTION, query: [] },
  { name: GAME_V2, model: GAME_V2, query: [] },
  { name: SITE_GAME_V2, model: SITE_GAME_V2, query: [] },
  { name: EU_JACKPOT_SECTIONS, model: EU_JACKPOT_SECTIONS, query: [] },
  { name: LAYOUT_MODEL, model: LAYOUT_MODEL, query: [`fields.entryTitle[match]=\\[desktop\\]`] },
  /* Bellow ones are not needed, because section pulls the data for all of them
    { name: CAROUSEL_A_SECTIONS, model: CAROUSEL_A_SECTIONS, query: []},
    { name: DFG_SECTION, model: DFG_SECTION, query: []},
    { name: IG_JACKPOTS_SECTION, model: IG_JACKPOTS_SECTION, query: [] }, 
  */
  { name: CATEGORY_MODEL, model: CATEGORY_MODEL, query: [] },
  { name: CATEGORIES_MODEL, model: CATEGORIES_MODEL, query: [] },
  // {name: BANNER_SECTION, model: BANNER_SECTION, query: [] },
  // {name: IG_BANNER_SECTION, model: IG_BANNER_SECTION, query: [] },
  // {name: MARKETING_SECTION, model: MARKETING_SECTION, query: [] },
  // {name: IG_MARKETING_SECTION, model: IG_MARKETING_SECTION, query: [] }
];
const CONTENT_TYPES_V2 = [GAME_V2, SITE_GAME_V2];

const UK_VENTURES = [
  "jackpotjoy",
  "virgingames",
  "heart",
  "starspins",
  "rainbowriches",
  "rainbowrichescasino",
  "monopolycasino",
];
const KNOWN_EU_VENTURES = ['ballybet','ballyuk', 'virgingames', 'jackpotjoy', 'monopolycasino', 'rainbowriches', 'botemania', 'monopolycasinospain', 'virgincasino', 'megawayscasino', 'doublebubblebingo', 'starspins', 'canalbingo', 'heart'];
const CURRENT_EU_VENTURES = ['ballyuk', 'virgingames', 'jackpotjoy', 'monopolycasino', 'rainbowriches', 'botemania', 'monopolycasinospain', 'virgincasino', 'megawayscasino', 'doublebubblebingo'];
const ES_VENTURES = ["botemania", "canalbingo", "monopolycasinospain"];
const PRODUCTION_VENTURES_TYPOS = [
  "jackpoyjoy",
  "jackpotoy",
  "virgngames",
  "monopoly",
  "monopoly casino",
  "double bubble",
  "Double Bubble Bingo",
  "virgin",
  "bally",
  "rainbowrichescasino"
];
// virgingames} ...
// monopoly} ...

const PRODUCTION_VENTURES_TYPOS_MAP = [
  ["jackpoyjoy", "jackpotjoy"],
  ["jackpotoy", "jackpotjoy"],
  ["virgngames", "virgingames"],
  ["monopoly", "monopolycasino"],
  ["monopoly casino", "monopolycasino"],
  ["double bubble", "doublebubblebingo"],
  ["double dubble bingo", "doublebubblebingo"],
  ["double dubble dingo", "doublebubblebingo"],
  ["virgin", "virgingames"],
  ["bally", "ballycasinonj"],
  ["rainbowrichescasino", "rainbowriches"]
];

const NA_VENTURES = [
  "ballycasinonj",
  "ballybetpa",
  "ballybetin",
  "ballybetaz",
  "ballybetny",
  "virgincasino",
  "tropicana",
];
const CA_VENTURES = ["ballybeton", "ballycasinoontario"];
const NA_VENTURES_TYPOS = ["ballybetontario"];

const PRODUCTION_VENTURE_LIST = [
  ...UK_VENTURES,
  ...ES_VENTURES,
  ...PRODUCTION_VENTURES_TYPOS,
];
const NA_VENTURE_LIST = [...NA_VENTURES, ...CA_VENTURES, ...NA_VENTURES_TYPOS];
const ALL_VENTURES_LIST = [...PRODUCTION_VENTURE_LIST, ...NA_VENTURE_LIST];

const LOCALIZED_GAME_FIELDS = [
  "howToPlayContent",
  "infoDetails",
  "introductionContent",
  "maxBet",
  "minBet",
  "title",
];
const REQUIRED_SITE_GAME_FIELDS = [
  "entryTitle",
  "environment",
  "venture",
  "game",
];


const JACKPOT_TYPES = [
  "bingo-jackpots",
  "blueprint-jackpots",
  "everi-jackpots",
  "mega-moolah-jackpots",
  "net-ent-jackpots",
  "red-tiger-jackpots",
  "roxor-jackpots",
  "sg-digital-jackpots",
  "headless-jackpots"
];

export {
  PRODUCTION_SPACE,
  NA_SPACE,
  PRODUCTION_VENTURES_TYPOS,
  SITE_GAME,
  GAME,
  GAME_INFO,
  GAME_CONFIG,
  SECTION,
  GAME_V2,
  VENTURE,
  UK_VENTURES,
  ES_VENTURES,
  NA_VENTURES,
  CA_VENTURES,
  NA_VENTURE_LIST,
  PRODUCTION_VENTURE_LIST,
  CONTENT_TYPES,
  CONTENT_TYPES_V2,
  SITE_GAME_V2,
  ALL_VENTURES_LIST,
  LOCALIZED_GAME_FIELDS,
  REQUIRED_SITE_GAME_FIELDS,
  MINI_GAMES,
  IG_MINI_GAMES,
  LOBBY_COLLAB_BASED_SECTIONS,
  IG_COLLAB_BASED_SECTIONS,
  LOBBY_SUGGESTED_GAMES,
  IG_LOBBY_SUGGESTED_GAMES,
  SIMILARITY_SECTIONS,
  IG_SIMILARITY_SECTIONS,
  IG_SECTION_WITHOUT_CAROUSEL,
  LAYOUT_MODEL,
  IG_VIEW_MODEL,
  IG_LINK_MODEL,
  CATEGORY_MODEL,
  CAROUSEL_A_SECTIONS,
  IG_CAROUSEL_A_SECTIONS,
  IG_CAROUSEL_B_SECTIONS,
  DFG_SECTION,
  IG_DFG_SECTION,
  CATEGORIES_MODEL,
  IG_NAVIGATION_MODEL,
  IG_JACKPOTS_SECTION,
  BANNER_SECTION,
  IG_BANNER_SECTION,
  MARKETING_SECTION,
  IG_MARKETING_SECTION,
  EU_JACKPOT_SECTIONS,
  JACKPOT_TYPES,
  KNOWN_EU_VENTURES,
  CURRENT_EU_VENTURES,
  PRODUCTION_VENTURES_TYPOS_MAP,
  IG_GRID_A_SECTION,
  IG_GRID_B_SECTION,
  IG_GRID_C_SECTION, 
  IG_GRID_D_SECTION,
  IG_GRID_E_SECTION,
  IG_GRID_F_SECTION,
  IG_GRID_G_SECTION,
  IG_PROMOTIONS_GRID,
  IG_SEARCH_RESULTS,
  IG_GAME_SHUFFLE_SECTION,
  IG_BRAZE_PROMO_SECTION
};
