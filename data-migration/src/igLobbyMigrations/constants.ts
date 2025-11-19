const PRODUCTION_SPACE = "nw2595tc1jdx";

const VENTURE = "venture";
const JURISDICTION = "jurisdiction";

const GAME_V2 = "gameV2";
const SITE_GAME_V2 = "siteGameV2";

const IG_VIEW_MODEL = 'igView';
const IG_NAVIGATION_MODEL = 'igNavigation';
const IG_LINK_MODEL = 'igLink';
const IG_QUICK_LINKS_MODEL = 'igQuickLinks';
const IG_MINI_GAMES = "igMiniGames";
const IG_COLLAB_BASED_SECTIONS = 'igCollabBasedPersonalisedSection';
const IG_SIMILARITY_SECTIONS = "igSimilarityBasedPersonalisedSection";
const IG_LOBBY_SUGGESTED_GAMES = "igSuggestedGames"

const IG_JACKPOTS_SECTION = 'igJackpotsSection';
const IG_DFG_SECTION = "igDfgSection";

const IG_CAROUSEL_A_SECTIONS = "igCarouselA";
const IG_CAROUSEL_B_SECTIONS = "igCarouselB";
const IG_SEARCH_RESULTS = "igSearchResults";
const IG_GRID_A_SECTION = "igGridASection";
const IG_GRID_B_SECTION = "igGridBSection";
const IG_GRID_C_SECTION = "igGridCSection";
const IG_GRID_D_SECTION = "igGridDSection";
const IG_GRID_E_SECTION = "igGridESection";
const IG_GRID_F_SECTION = "igGridFSection";
const IG_GRID_G_SECTION = "igGridGSection";

interface ContentType { name: string; model: string; query: Array<string>; }

const CONTENT_TYPES: ContentType[] = [
  { name: VENTURE, model: VENTURE, query: [] },
  { name: SITE_GAME_V2, model: SITE_GAME_V2, query: [] }
];

const CONTENT_TYPES_V2 = [GAME_V2, SITE_GAME_V2];

const UK_VENTURES = [
  "jackpotjoy",
  "virgingames",
  "rainbowriches",
  "rainbowrichescasino",
  "monopolycasino",
  "ballyuk"
];
const ES_VENTURES = ["botemania", "monopolycasinospain"];
const PRODUCTION_VENTURES_TYPOS = [
  "jackpoyjoy",
  "jackpotoy",
  "virgngames",
  "monopoly",
  "double bubble",
  "virgin",
  "bally"
];


const PRODUCTION_VENTURE_LIST = [
  ...UK_VENTURES,
  ...ES_VENTURES,
  ...PRODUCTION_VENTURES_TYPOS,
];

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

export {
  PRODUCTION_SPACE,
  PRODUCTION_VENTURES_TYPOS,
  GAME_V2,
  VENTURE,
  UK_VENTURES,
  ES_VENTURES,
  PRODUCTION_VENTURE_LIST,
  CONTENT_TYPES,
  CONTENT_TYPES_V2,
  SITE_GAME_V2,
  LOCALIZED_GAME_FIELDS,
  REQUIRED_SITE_GAME_FIELDS,
  IG_MINI_GAMES,
  IG_COLLAB_BASED_SECTIONS,
  IG_LOBBY_SUGGESTED_GAMES,
  IG_SIMILARITY_SECTIONS,
  IG_VIEW_MODEL,
  IG_LINK_MODEL,
  IG_CAROUSEL_A_SECTIONS,
  IG_DFG_SECTION,
  IG_NAVIGATION_MODEL,
  IG_JACKPOTS_SECTION,
  IG_GRID_A_SECTION,
  JURISDICTION,
  IG_GRID_B_SECTION,
  IG_GRID_C_SECTION,
  IG_GRID_E_SECTION,
  IG_QUICK_LINKS_MODEL,
  IG_SEARCH_RESULTS,
  IG_GRID_D_SECTION,
  IG_GRID_F_SECTION,
  IG_GRID_G_SECTION,
  IG_CAROUSEL_B_SECTIONS
};
