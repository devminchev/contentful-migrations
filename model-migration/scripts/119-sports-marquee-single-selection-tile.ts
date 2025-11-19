import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	// Sports Marquee Single Market Tile
	const sportsMarqueeSingleSelectionTile = migration
		.createContentType('sportsMarqueeSingleSelectionTile')
		.name('Sports Marquee Single Selection Tile')
		.description('Sports Marquee Single Selection Tile used within a Sports marquee/carousel. Can display a single selection for all market types.')
		.displayField('entryTitle');

	sportsMarqueeSingleSelectionTile.createField('entryTitle').name('entryTitle').type('Symbol');

	sportsMarqueeSingleSelectionTile.createField('groupPath').name('Group Path').type('Symbol').required(true);
	sportsMarqueeSingleSelectionTile.changeFieldControl('groupPath', 'builtin', 'singleLine', {
		helpText: 'The group path the selected fixture belongs to. E.g. football/england/premier_league',
	});

	sportsMarqueeSingleSelectionTile.createField('fixtureId').name('Fixture Id').type('Symbol').required(true);
	sportsMarqueeSingleSelectionTile.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
		helpText: 'The fixture id the selected market belongs to.',
	});

	sportsMarqueeSingleSelectionTile.createField('marketTypeId').name('Market Type Id').type('Symbol').required(true);
	sportsMarqueeSingleSelectionTile.changeFieldControl('marketTypeId', 'builtin', 'singleLine', {
		helpText: 'The Market Type Id of the selected market. Used by the frontends together with the Market Specifier Id to correctly identify the market in between fixture transitions, from pre-game to live.',
	});

	sportsMarqueeSingleSelectionTile.createField('marketSpecifierId').name('Market Specifier Id').type('Symbol').required(true);
	sportsMarqueeSingleSelectionTile.changeFieldControl('marketSpecifierId', 'builtin', 'singleLine', {
		helpText:
			'The Market Specifier Id of the selected market. Used by the frontends together with the Market Type Id to correctly identify the market in between fixture transitions, from pre-game to live.',
	});

	sportsMarqueeSingleSelectionTile.createField('selectionId').name('Selection Id').type('Symbol').required(true);
	sportsMarqueeSingleSelectionTile.changeFieldControl('selectionId', 'builtin', 'singleLine', {
		helpText:
			'The Selection Id of the selected market selection. Used by the frontends together with the Market Type and Specifier Id to correctly identify the selection in between fixture transitions, from pre-game to live.',
	});

	sportsMarqueeSingleSelectionTile
		.createField('status')
		.name('Status')
		.type('Array')
		.localized(false)
		.required(true)
		.items({
			type: 'Symbol',
			validations: [
				{
					in: ['showPreGame', 'showLive'],
				},
			],
		})
		.defaultValue({
			[LOCALE]: ['showPreGame']
		});
	sportsMarqueeSingleSelectionTile.changeFieldControl('status', 'builtin', 'checkbox', {
		helpText: 'Determines whether a tile can transition to live (if available) or just display pre-game, or vice-versa, or both.',
	});

	sportsMarqueeSingleSelectionTile.createField('description').name('Description').type('Symbol').localized(true);
	sportsMarqueeSingleSelectionTile.changeFieldControl('description', 'builtin', 'singleLine', {
		helpText:
			'Provides the ability to override the selection name as these can sometimes be incorrect or too long from the Sports data provider.',
	});

	sportsMarqueeSingleSelectionTile.createField('backgroundImage')
		.name('Background Image')
		.type('Object')
		.localized(true)
		.validations([
			{
				size: {
					min: 1,
					max: 1
				}
			}
		]);
	sportsMarqueeSingleSelectionTile.changeFieldControl('backgroundImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
		helpText: "Provides a background image for the selection tile. If no image is provided, it will fallback to one of the light, dark or glass tile designs.",
	});

	sportsMarqueeSingleSelectionTile
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
	sportsMarqueeSingleSelectionTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the Sports Marquee Single Selection Tile should be active',
	});

	// Update the Marquee Items to include the Single Selection tile
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
					'sportsMarqueeScoreboardTile',
					'sportsMarqueeSingleSelectionTile'
				],
			},
		],
	});
}) as MigrationFunction;
