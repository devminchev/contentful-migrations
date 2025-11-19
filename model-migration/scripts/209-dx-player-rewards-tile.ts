import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	// Dx Player Rewards Tile
	const dxPlayerRewardsTile = migration
		.createContentType('dxPlayerRewardsTile')
		.name('Dx Player Rewards Tile')
		.description(`Digital Experience (Dx) Player Rewards Tile responsible for displaying the player's rewards within the marquee.`)
		.displayField('entryTitle');

	dxPlayerRewardsTile
		.createField('entryTitle')
		.name('entryTitle')
		.type('Symbol')
		.required(true);
	dxPlayerRewardsTile.changeFieldControl('entryTitle', 'builtin', 'singleLine', {
		helpText: 'The entryTitle should follow the following format: [entry title] [brand] [jurisdiction] [product] [platform] e.g. player rewards tile [ballybet] [US-AZ] [SPORTS] [WEB]'
	});

	dxPlayerRewardsTile
		.createField('rewardStatus')
		.name('Reward Status')
		.type('Array')
		.localized(false)
		.required(true)
		.items({
			type: 'Symbol',
			validations: [
				{
					in: [
						'ACTIVE',
						'IN_USE',
						'USED',
						'EXPIRED',
						'CANCELLED'
					],
				},
			],
		})
		.defaultValue({
			[LOCALE]: [
				'ACTIVE',
				'IN_USE',
				'USED',
				'EXPIRED',
				'CANCELLED'
			]
		});
	dxPlayerRewardsTile.changeFieldControl('rewardStatus', 'builtin', 'checkbox', {
		helpText: 'Determines which rewards appear for the user depending on their current status',
	});

	dxPlayerRewardsTile
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
	dxPlayerRewardsTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the Dx Player Rewards Tile should be active',
	});

	// Add Dx Player Reward Tile to the Marquee and a Product field
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
					'dxPlayerRewardsTile'
				],
			},
		],
	});

	dxMarquee
		.createField('product')
		.name('Product')
		.type('Array')
		.items({
			type: 'Link',
			linkType: 'Entry',
			validations: [
				{
					linkContentType: ['dxProduct']
				}
			]
		});
	dxMarquee.changeFieldControl('product', 'builtin', 'entryLinksEditor', {
		helpText: 'The product the Dx Marquee belongs to. Primarily used for the Promotions page to determine under which tab the marquee should display under.'
	});

	// Update Dx Promotions with a rewards field
	const dxPromotions = migration.editContentType('dxPromotions');

	dxPromotions.createField('rewards')
		.name('Rewards')
		.type('Array')
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxMarquee"],
				},
			],
		});
	dxPromotions.changeFieldControl('rewards', 'builtin', 'entryLinksEditor', {
		helpText: `Allows specification of a marquee to display the player rewards. The product field on the marquee will determine which tab this gets displayed under on the promotions page.`
	});
	dxPromotions.moveField('rewards').afterField('entryTitle');

}) as MigrationFunction;
