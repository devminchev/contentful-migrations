import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
	// THE BIG PURGE!!!!!
	// Remove old Sports Marquee content types
	migration.deleteContentType('sportsMarqueeCustomTile');
	migration.deleteContentType('sportsMarqueeJudoTile');
	migration.deleteContentType('sportsMarqueeSingleSelectionTile');
	migration.deleteContentType('sportsMarqueeSingleMarketTile'); 
	migration.deleteContentType('sportsMarqueeSixPackTile');
	migration.deleteContentType('sportsMarqueePriceBoostTile');
	migration.deleteContentType('sportsMarquee');
	migration.deleteContentType('sportsQuickLinks');
	migration.deleteContentType('sportsLink');
	migration.deleteContentType('sportsTabs');
	migration.deleteContentType('sportsTab');
	migration.deleteContentType('sportsTabItem');
	migration.deleteContentType('sportsView');
	migration.deleteContentType('sportsSport');
}) as MigrationFunction;
