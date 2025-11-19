import {MigrationFunction} from "contentful-migration";

export = ((migration) => {
	// Promotions Content Card
	const dxPromotionContentCard = migration
		.createContentType('dxPromotionContentCard')
		.name('Dx Promotion Content Card')
		.description('An individual promotions content card to be used within the marquee or promotions page')
		.displayField('entryTitle');

	dxPromotionContentCard.createField('entryTitle').name('Entry Title').type('Symbol');

	dxPromotionContentCard.createField('title').name('Title').type('Symbol').localized(true);
	dxPromotionContentCard.changeFieldControl('title', 'builtin', 'singleLine', {
		helpText: 'The title of the promotion'
	});

	dxPromotionContentCard.createField('description').name('Description').type('Symbol').localized(true);
	dxPromotionContentCard.changeFieldControl('description', 'builtin', 'singleLine', {
		helpText: 'The description of the promotion'
	});

	dxPromotionContentCard.createField('image').name('Image').type('Text').localized(true);
	dxPromotionContentCard.changeFieldControl('image', 'builtin', 'singleLine', {
		helpText: 'Relative or Absolute path to Image in CDN',
	});

	dxPromotionContentCard
		.createField("promotionIdentifier")
		.name("Promotion Identifier")
		.type("Symbol")
		.localized(false);
	dxPromotionContentCard.changeFieldControl('promotionIdentifier', 'builtin', 'singleLine', {
		helpText: 'This represents the unique identifier for the promotion, usually available from other tooling options like Braze'
	});

	dxPromotionContentCard
		.createField("link")
		.name("Link")
		.type("Link")
		.localized(false)
		.required(true)
		.validations([
			{
				linkContentType: ["dxLink"],
			},
		])
		.linkType("Entry");
	dxPromotionContentCard.changeFieldControl("link", "builtin", "entryLinkEditor", {
		helpText: "The call to action for the promotion content card, typically used when displayed on the promotions page",
	});


	// Promotions collection
	const dxPromotions = migration
		.createContentType("dxPromotions")
		.name("Dx Promotions")
		.description("A collection of Digital Experience (Dx) promotions")
		.displayField("entryTitle");

	dxPromotions.createField('entryTitle').name('Entry Title').type('Symbol');

	dxPromotions
		.createField("promotions")
		.name("Promotions Content Cards")
		.type("Array")
		.localized(false)
		.required(false)
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxPromotionContentCard"],
				},
			],
		});

	// Update the View to use the Dx Promotion in the primary content section
	const dxView = migration.editContentType('dxView');

	dxView.editField('primaryContent').items({
		type: 'Link',
		linkType: 'Entry',
		validations: [
			{
				linkContentType: [
					"dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxPromotionDetails", "dxTabs", 'dxPromotions'
				],
			},
		],
	});

	// Update the Marquee Items to include the Braze tile
	const dxMarquee = migration.editContentType('dxMarquee');
	dxMarquee.editField('marqueeItems').items({
		type: 'Link',
		linkType: 'Entry',
		validations: [
			{
				linkContentType: ['dxMarqueeCustomTile', 'dxMarqueeBrazeTile', 'sportsMarqueePrePackTile', 'dxPromotionContentCard'],
			},
		],
	});

}) as MigrationFunction;
