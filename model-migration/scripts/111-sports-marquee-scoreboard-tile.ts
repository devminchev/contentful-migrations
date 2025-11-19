import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	// Sports Marquee Single Market Tile
	const sportsMarqueeScoreboardTile = migration
		.createContentType('sportsMarqueeScoreboardTile')
		.name('Sports Marquee Scoreboard Tile')
		.description('Scoreboard Marquee Tile used within a Sports marquee/carousel. Can display a single market, typically a 2Way or 3Way market, with a scoreboard UI.')
		.displayField('entryTitle');

	sportsMarqueeScoreboardTile.createField('entryTitle').name('entryTitle').type('Symbol');

	sportsMarqueeScoreboardTile.createField('groupPath').name('Group Path').type('Symbol').required(true);
	sportsMarqueeScoreboardTile.changeFieldControl('groupPath', 'builtin', 'singleLine', {
		helpText: 'The group path the selected fixture belongs to. E.g. football/england/premier_league',
	});

	sportsMarqueeScoreboardTile.createField('fixtureId').name('Fixture Id').type('Symbol').required(true);
	sportsMarqueeScoreboardTile.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
		helpText: 'The fixture id the selected market belongs to.',
	});

	sportsMarqueeScoreboardTile.createField('marketTypeId').name('Market Type Id').type('Symbol').required(true);
	sportsMarqueeScoreboardTile.changeFieldControl('marketTypeId', 'builtin', 'singleLine', {
		helpText: 'The Market Type Id of the selected market. Used by the frontends together with the Market Specifier Id to correctly identify the market in between fixture transitions, from pre-game to live.',
	});

	sportsMarqueeScoreboardTile.createField('marketSpecifierId').name('Market Specifier Id').type('Symbol').required(true);
	sportsMarqueeScoreboardTile.changeFieldControl('marketSpecifierId', 'builtin', 'singleLine', {
		helpText:
			'The Market Specifier Id of the selected market. Used by the frontends together with the Market Type Id to correctly identify the market in between fixture transitions, from pre-game to live.',
	});

	sportsMarqueeScoreboardTile
		.createField('segmentation')
		.name('Segmentation')
		.type('Array')
		.localized(false)
		.required(false)
		.items({
			type: 'Symbol',
			validations: [
				{
					in: ['showWhenLoggedIn', 'showWhenLoggedOut'],
				},
			],
		});
	sportsMarqueeScoreboardTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the Sports Marquee Scoreboard Tile should be active',
	});

	// Update the Marquee Items to include the Scoreboard tile
	const dxMarquee = migration.editContentType('dxMarquee');
	dxMarquee.editField('marqueeItems').items({
		type: 'Link',
		linkType: 'Entry',
		validations: [
			{
				linkContentType: [
					'dxMarqueeCustomTile',
					'dxMarqueeBrazeTile',
					'sportsMarqueePrePackTile',
					'dxPromotionContentCard',
					'sportsMarqueeKambiPrePackTile',
					'dxBrazePromotionContentCard',
					'sportsMarqueeScoreboardTile'
				],
			},
		],
	});
}) as MigrationFunction;
