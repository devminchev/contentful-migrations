import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	// consolidated Sports Marquee Tile
	const sportsMarqueeTile = migration
		.createContentType('sportsMarqueeMarketAndSelectionTile')
		.name('Sports Marquee Market and Selection Tile')
		.description('A consolidated sports marquee tile that supports multiple tile types: Single Selection, Scoreboard, Six Pack and Specials Boosts.')
		.displayField('entryTitle');

	sportsMarqueeTile.createField('entryTitle').name('entryTitle').type('Symbol');

	// new type field
	sportsMarqueeTile
		.createField('type')
		.name('Type')
		.type('Symbol')
		.localized(false)
		.required(true)
		.validations([
			{
				in: ['singleSelection', 'scoreboard', 'sixPack', 'specialsBoosts'],
			},
		]);
	sportsMarqueeTile.changeFieldControl('type', 'builtin', 'dropdown', {
		helpText: 'Select the type of tile: Single Selection Tile, Scoreboard Tile, Six Pack Tile or Specials Boost Tile',
	});

	sportsMarqueeTile.createField('groupPath').name('Group Path').type('Symbol').required(true);
	sportsMarqueeTile.changeFieldControl('groupPath', 'builtin', 'singleLine', {
		helpText: 'The group path the selected fixture belongs to. E.g. football/england/premier_league.',
	});

	sportsMarqueeTile.createField('fixtureId').name('Fixture Id').type('Symbol').required(true);
	sportsMarqueeTile.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
		helpText: 'The fixture id the selected market belongs to.',
	});

	sportsMarqueeTile.createField('marketTypeId').name('Market Type Id').type('Symbol');
	sportsMarqueeTile.changeFieldControl('marketTypeId', 'builtin', 'singleLine', {
		helpText: 'The Market Type Id of the selected market. Required for Single Selection, Scoreboard, and Specials Boost tiles.',
	});

	sportsMarqueeTile.createField('marketSpecifierId').name('Market Specifier Id').type('Symbol');
	sportsMarqueeTile.changeFieldControl('marketSpecifierId', 'builtin', 'singleLine', {
		helpText: 'The Market Specifier Id of the selected market. Required for Single Selection, Scoreboard, and Specials Boost tiles.',
	});

	sportsMarqueeTile.createField('selectionId').name('Selection Id').type('Symbol');
	sportsMarqueeTile.changeFieldControl('selectionId', 'builtin', 'singleLine', {
		helpText: 'The Selection Id of the selected market selection. Required for Single Selection and Specials Boost tiles.',
	});

	// Status field
	sportsMarqueeTile
		.createField('status')
		.name('Status')
		.type('Array')
		.localized(false)
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
	sportsMarqueeTile.changeFieldControl('status', 'builtin', 'checkbox', {
		helpText: 'Determines whether a tile can transition to live (if available) or just display pre-game, or vice-versa, or both. Used for Single Selection, Scoreboard, and Six Pack tiles.',
	});

	// Description field
	sportsMarqueeTile.createField('description').name('Description').type('Symbol').localized(true);
	sportsMarqueeTile.changeFieldControl('description', 'builtin', 'singleLine', {
		helpText: 'Provides the ability to override the selection name or description as these can sometimes be incorrect or too long from the Sports data provider.',
	});

	// Background Image field
	sportsMarqueeTile.createField('backgroundImage')
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
	sportsMarqueeTile.changeFieldControl('backgroundImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
		helpText: "Provides a background image for the tile. If no image is provided, it will fallback to one of the light, dark or glass tile designs.",
	});

	// Segmentation field
	sportsMarqueeTile
		.createField('segmentation')
		.name('Segmentation')
		.type('Array')
		.localized(false)
		.required(true)
		.items({
			type: 'Symbol',
			validations: [
				{
					in: ['showWhenLoggedIn', 'showWhenLoggedOut'],
				},
			],
		})
		.defaultValue({
			[LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
		});
	sportsMarqueeTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the Sports Marquee Tile should be active',
	});

	const fieldGroup = sportsMarqueeTile.createEditorLayout().createFieldGroup('default').name('Default Fields')
	fieldGroup.createFieldGroup('required').name('Required')
	fieldGroup.createFieldGroup('additional').name('Additional required')
	fieldGroup.createFieldGroup('optional').name('Optional')

	const editLayout = sportsMarqueeTile.editEditorLayout()
	
	editLayout.changeFieldGroupControl('required', 'builtin', 'fieldset', {
		helpText: 'Required fields for all tiles'
	})
	editLayout.changeFieldGroupControl('additional', 'builtin', 'fieldset', {
			helpText: 'Additional required fields for Single Selection Tile, Scoreboard Tile and Specials Boost Tile'
		})
	editLayout.changeFieldGroupControl('optional', 'builtin', 'fieldset', {
			helpText: 'Optional fields for all tiles'
		})

	// Add fields to required group
	editLayout.moveField('groupPath').toTheTopOfFieldGroup('required')
	editLayout.moveField('fixtureId').toTheTopOfFieldGroup('required')
	editLayout.moveField('segmentation').toTheTopOfFieldGroup('required')

	// Add fields to additional group
	editLayout.moveField('marketTypeId').toTheTopOfFieldGroup('additional')
	editLayout.moveField('marketSpecifierId').toTheTopOfFieldGroup('additional')
	editLayout.moveField('selectionId').toTheTopOfFieldGroup('additional')

	// Add fields to optional group
	editLayout.moveField('description').toTheTopOfFieldGroup('optional')
	editLayout.moveField('backgroundImage').toTheTopOfFieldGroup('optional')

	// Update dxMarquee
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
					'sportsMarqueeSixPackTile',
					'dxPlayerRewardsTile',
					'sportsMarqueeSpecialsBoostsTile',
					'sportsMarqueeSpecialsPrePackTile',
					'sportsMarqueeMarketAndSelectionTile'
				],
			},
		],
	});

}) as MigrationFunction;
