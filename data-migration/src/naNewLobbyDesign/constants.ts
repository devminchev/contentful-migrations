const PRODUCTION_SPACE = "nw2595tc1jdx";
const NA_SPACE = "6hs6aj69c5cq";

const SITE_GAME = "siteGame";
const GAME = "game";
const GAME_INFO = "gameInfo";
const GAME_CONFIG = "gameConfig";
const SECTION = "section";
const VENTURE = "venture";
const JURISDICTION = "jurisdiction";

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
const CATEGORY_MODEL = 'igNavigation';
const CATEGORIES_MODEL = 'igNavigation';
const IG_LINK_MODEL = 'igLink';
const IG_QUICK_LINKS_MODEL = 'igQuickLinks';
const IG_NAVIGATION_MODEL = 'igNavigation';
const IG_SECTION_WITHOUT_CAROUSEL = "igGridASection";
const CAROUSEL_A_SECTIONS = "section";
const IG_CAROUSEL_A_SECTIONS = "igCarouselA";
const IG_CAROUSEL_B_SECTIONS = "igCarouselB";
const IG_JACKPOTS_SECTION = 'igJackpotsSection';
const DFG_SECTION = "section";
const IG_DFG_SECTION = "igDfgSection";

// -------------------------------------------------- //
const NAVIGATION_MODEL_CONFIG = "navigationConfig";
const DX_PLACEHOLDER = "dxPlaceholder";
const IG_SEARCH_RESULTS = "igSearchResults";
const IG_GRID_A_SECTION = "igGridASection";
const IG_GRID_B_SECTION = "igGridBSection";
const IG_GRID_C_SECTION = "igGridCSection";
const IG_GRID_D_SECTION = "igGridDSection";
const IG_GRID_E_SECTION = "igGridESection";
const IG_GRID_F_SECTION = "igGridFSection";
const IG_GRID_G_SECTION = "igGridGSection";
const DX_VIEW = "dxView";
const IG_VIEW = "igView";
const DX_QUICK_LINKS = "dxQuickLinks";
const DX_LINK = "dxLink";
const IG_BRAZE_PROMO_SECTION = 'igBrazePromosSection';
const IG_JACKPOT_SECTION = 'igJackpotsSection';

interface ContentType { name: string; model: string; query: Array<string>; }

const IG_LINK_CONTENT_TYPES: ContentType = {
  name: IG_LINK_MODEL,
  model: IG_LINK_MODEL,
  query: [`fields.entryTitle[match]=\\[casino\\]\\[web\\]`],
}

const CONTENT_TYPES: ContentType[] = [
  { name: VENTURE, model: VENTURE, query: [] },
  { name: DX_VIEW, model: DX_VIEW, query: [`fields.entryTitle[match]=\\[casino\\]`] },
  { name: DX_LINK, model: DX_LINK, query: [`fields.entryTitle[match]=\\[casino\\]\\[web\\]`] },
  { name: DX_QUICK_LINKS, model: DX_QUICK_LINKS, query: [`fields.entryTitle[match]=\\[casino\\]\\[web\\]`] },
  { name: DX_PLACEHOLDER, model: DX_PLACEHOLDER, query: [] }
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
const ES_VENTURES = ["botemania", "canalbingo", "monopolycasinospain"];
const PRODUCTION_VENTURES_TYPOS = [
  "jackpoyjoy",
  "jackpotoy",
  "virgngames",
  "monopoly",
  "double bubble",
  "virgin",
  "bally"
];
// virgingames} ...
// monopoly} ...

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

// Filenames specific for whitehat migration and linking
const UNMATCHED_WHITEHAT_GAMES = 'unmatchedGamesToLink.json';

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
  DFG_SECTION,
  IG_DFG_SECTION,
  CATEGORIES_MODEL,
  IG_NAVIGATION_MODEL,
  IG_JACKPOTS_SECTION,
  NAVIGATION_MODEL_CONFIG,
  IG_GRID_A_SECTION,
  JURISDICTION,
  DX_VIEW,
  IG_VIEW,
  IG_BRAZE_PROMO_SECTION,
  IG_GRID_B_SECTION,
  DX_PLACEHOLDER,
  IG_GRID_C_SECTION,
  IG_GRID_E_SECTION,
  IG_JACKPOT_SECTION,
  UNMATCHED_WHITEHAT_GAMES,
  DX_QUICK_LINKS,
  IG_QUICK_LINKS_MODEL,
  DX_LINK,
  IG_LINK_CONTENT_TYPES,
  IG_SEARCH_RESULTS,
  IG_GRID_D_SECTION,
  IG_GRID_F_SECTION,
  IG_GRID_G_SECTION,
  IG_CAROUSEL_B_SECTIONS
};
