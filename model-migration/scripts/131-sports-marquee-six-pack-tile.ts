import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	// Sports Marquee Six Pack Tile
	const sportsMarqueeSixPackTile = migration
		.createContentType('sportsMarqueeSixPackTile')
		.name('Sports Marquee Six Pack Tile')
		.description('Sports Marquee Six Pack Tile used within a Sports marquee/carousel. Can display a combination of 3 markets, typically a spread, moneyline and total.')
		.displayField('entryTitle');

	sportsMarqueeSixPackTile.createField('entryTitle').name('entryTitle').type('Symbol');

	sportsMarqueeSixPackTile
		.createField('groupPath')
		.name('Group Path')
		.type('Symbol')
		.required(true)
		.validations([
			{
				regexp: {
					pattern: "^(american_football|basketball|baseball|ice_hockey|tennis)(/[a-zA-Z0-9_-]+)?$"
				},
				message: "The six pack tile can only be created for the following sports: american_football - basketball - baseball - ice_hockey - tennis"
			}
		])
	sportsMarqueeSixPackTile.changeFieldControl('groupPath', 'builtin', 'singleLine', {
		helpText: 'The group path the selected fixture belongs to. E.g. american_football/nfl. The six pack tile can only be created for the following sports: american_football - basketball - baseball - ice_hockey - tennis',
	});

	sportsMarqueeSixPackTile.createField('fixtureId').name('Fixture Id').type('Symbol').required(true);
	sportsMarqueeSixPackTile.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
		helpText: 'The fixture id the selected market belongs to.',
	});

	sportsMarqueeSixPackTile
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
	sportsMarqueeSixPackTile.changeFieldControl('status', 'builtin', 'checkbox', {
		helpText: 'Determines whether a tile can transition to live (if available) or just display pre-game, or vice-versa, or both.',
	});

	sportsMarqueeSixPackTile.createField('backgroundImage')
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
	sportsMarqueeSixPackTile.changeFieldControl('backgroundImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
		helpText: "Provides a background image for the six pack tile. If no image is provided, it will fallback to one of the light, dark or glass tile designs.",
	});

	sportsMarqueeSixPackTile
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
	sportsMarqueeSixPackTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the Sports Marquee Six Pack Tile should be active',
	});

	// Update the Marquee Items to include the Six Pack tile
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
					'sportsMarqueeSingleSelectionTile',
					'sportsMarqueeSixPackTile'
				],
			},
		],
	});
}) as MigrationFunction;
