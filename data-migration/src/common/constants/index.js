const PRODUCTION_SPACE = "nw2595tc1jdx";
const NA_SPACE = "6hs6aj69c5cq";

const UK_VENTURES = ["jackpotjoy", "virgingames", "heart", "starspins", "rainbowriches", "rainbowrichescasino", "monopolycasino"];
const ES_VENTURES = ["botemania", "canalbingo", "monopolycasinospain"];

const NA_VENTURES = ["ballycasinonj", "ballybetpa", "ballybetin", "ballybetaz", "ballybetny", "virgincasino", "tropicana"];
const CA_VENTURES = ["ballybeton", "ballycasinoontario"];

const PRODUCTION_VENTURE_LIST = [...UK_VENTURES, ...ES_VENTURES];
const NA_VENTURE_LIST = [...NA_VENTURES, ...CA_VENTURES];
const ALL_VENTURES_LIST = [...PRODUCTION_VENTURE_LIST, ...NA_VENTURE_LIST];

// FOOTER
const FOOTER = "footer";
const FOOTER_ICON = "footerIcon";
const FOOTER_LINK = "footerLink";

// POLICY
const POLICY = "policy";

// CATEGORIES
const CATEGORIES = "categories";
const CATEGORY = "category";

// GAMES
const GAME = "game";
const GAME_CONFIG = "gameConfig";
const GAME_INFO = "gameInfo";
const SITE_GAME = "siteGame";

// KYC RE
const KRE_PAGE = "krePage";
const KRE_BUTTON = "kreButton";
const KRE_SECTION = "kreSection";
const KRE_SMALL_TEXT = "kreSmallText";
const KRE_YOTI = "kreYoti";

// LAYOUT
const LAYOUT = "layout";
const SECTION = "section";

// MINI_GAMES
const MINI_GAMES = "miniGames";

// RECOMMENDED_GAMES
const RECOMMENDED_GAMES = "recommendedGames";

// RG
const RG_BUTTON = "rgButton";
const RG_OVERLAY_RESULT_SCREEN = "rgOverlayResultScreen";
const RG_QUESTIONNAIRE_PAGE = "rgQuestionnairePage";
const RG_QUESTIONNAIRE_WELCOME_SCREEN = "rgQuestionnaireWelcomeScreen";

// SITE
const SITE = "site";
const VENTURE = "venture";

const CONTENT_TYPES = [
	{ contentType: POLICY, hasVentureProperty: true },
	{ contentType: FOOTER_ICON, hasVentureProperty: false },
	{ contentType: FOOTER_LINK, hasVentureProperty: false },
	{ contentType: FOOTER, hasVentureProperty: true },
	{ contentType: CATEGORY, hasVentureProperty: false },
	{ contentType: CATEGORIES, hasVentureProperty: true },
	{ contentType: KRE_BUTTON, hasVentureProperty: false },
	{ contentType: KRE_PAGE, hasVentureProperty: false },
	{ contentType: KRE_SECTION, hasVentureProperty: false },
	{ contentType: KRE_SMALL_TEXT, hasVentureProperty: false },
	{ contentType: KRE_YOTI, hasVentureProperty: false },
	{ contentType: LAYOUT, hasVentureProperty: true },
	{ contentType: SECTION, hasVentureProperty: false },
	{ contentType: MINI_GAMES, hasVentureProperty: true },
	{ contentType: RECOMMENDED_GAMES, hasVentureProperty: true },
	{ contentType: SITE, hasVentureProperty: true },
	{ contentType: SITE_GAME, hasVentureProperty: true },
	{ contentType: GAME_INFO, hasVentureProperty: false },
	{ contentType: GAME, hasVentureProperty: true },
	{ contentType: GAME_CONFIG, hasVentureProperty: false },
	{ contentType: VENTURE, hasVentureProperty: false },
];

export {
	PRODUCTION_SPACE,
	NA_SPACE,
	UK_VENTURES,
	ES_VENTURES,
	NA_VENTURES,
	CA_VENTURES,
	NA_VENTURE_LIST,
	PRODUCTION_VENTURE_LIST,
	ALL_VENTURES_LIST,
	CONTENT_TYPES,
};
