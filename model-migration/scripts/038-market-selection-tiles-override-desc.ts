import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

	// Sports Marquee Single Selection Tile
	const sportsMarqueeSingleSelectionTile = migration.editContentType('sportsMarqueeSingleSelectionTile');

	sportsMarqueeSingleSelectionTile.createField('description').name('Description').type('Text').localized(true);
	sportsMarqueeSingleSelectionTile.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'Used to override the default tile description if entered',
  });
	sportsMarqueeSingleSelectionTile.moveField('description').afterField('image');

	// Sports Marquee Single Market Tile
	const sportsMarqueeSingleMarketTile = migration.editContentType('sportsMarqueeSingleMarketTile');

	sportsMarqueeSingleMarketTile.createField('description').name('Description').type('Text').localized(true);
	sportsMarqueeSingleMarketTile.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'Used to override the default tile description if entered',
  });
	sportsMarqueeSingleMarketTile.moveField('description').afterField('competitionId');

	// Sports Marquee Six Pack Tile
	const sportsMarqueeSixPackTile = migration.editContentType('sportsMarqueeSixPackTile');

	sportsMarqueeSixPackTile.createField('description').name('Description').type('Text').localized(true);
	sportsMarqueeSixPackTile.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'Used to override the default tile description if entered',
  });
	sportsMarqueeSixPackTile.moveField('description').afterField('competitionId');

	// Sports Marquee Price Boost Tile
	const sportsMarqueePriceBoostTile = migration.editContentType('sportsMarqueePriceBoostTile');

	sportsMarqueePriceBoostTile.createField('description').name('Description').type('Text').localized(true);
	sportsMarqueePriceBoostTile.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'Used to override the default tile description if entered',
  });
	sportsMarqueePriceBoostTile.moveField('description').afterField('previousAmericanPrice');

  
}) as MigrationFunction;
