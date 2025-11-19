const PRODUCTION_SPACE = "nw2595tc1jdx";
const NA_SPACE = "6hs6aj69c5cq";

const VENTURE = "venture";
const GAME_V2 = "gameV2";
const SITE_GAME_V2 = "siteGameV2";

const CONTENT_TYPES = [
  { name: SITE_GAME_V2, model: SITE_GAME_V2, query: [] },
  { name: GAME_V2, model: GAME_V2, query: [] },
];

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

export {
  PRODUCTION_SPACE,
  NA_SPACE,
  GAME_V2,
  SITE_GAME_V2,
  VENTURE,
  UK_VENTURES,
  ES_VENTURES,
  NA_VENTURES,
  CA_VENTURES,
  NA_VENTURE_LIST,
  PRODUCTION_VENTURE_LIST,
  CONTENT_TYPES,
  ALL_VENTURES_LIST,
  LOCALIZED_GAME_FIELDS,
  REQUIRED_SITE_GAME_FIELDS,
};
