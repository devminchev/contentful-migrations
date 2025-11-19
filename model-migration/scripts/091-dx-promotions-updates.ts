import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	// Promotions Home Page
	const dxPromotionContentCard = migration.editContentType('dxPromotionContentCard');

	dxPromotionContentCard
		.createField("product")
		.name("Product")
		.type("Array")
		.localized(false)
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxProduct"],
				},
			],
		});


	dxPromotionContentCard.changeFieldControl('product', 'builtin', 'entryLinksEditor', {
		helpText: "The product where the promotion content card should be available on"
	});

	dxPromotionContentCard
		.createField('terms')
		.name('Terms')
		.type('Symbol')
		.localized(true);
	dxPromotionContentCard.changeFieldControl('terms', 'builtin', 'singleLine', {
		helpText: 'The terms and conditions of the promotion'
	});
	dxPromotionContentCard.moveField('terms').afterField('description');

	dxPromotionContentCard
		.createField('bynderImage')
		.name('Bynder Image')
		.localized(true)
		.type('Object');
	// 5KySdUzG7OWuCE2V3fgtIa is the ID for the Bynder Image App
	dxPromotionContentCard.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
		helpText: 'The Bynder image to be used for the promotion content card',
	});
	dxPromotionContentCard.moveField('bynderImage').afterField('image');

	// Braze Content Card
	const dxBrazePromotionContentCard = migration
		.createContentType("dxBrazePromotionContentCard")
		.name("Dx Braze Promotion Content Card")
		.description("Digital Experience (Dx) Braze Promotion Content card to be used within marquee and promotions components")
		.displayField("entryTitle");

	dxBrazePromotionContentCard.createField("entryTitle").name("entryTitle").type("Symbol");

	dxBrazePromotionContentCard.createField('promotionFilter').name('Promotion Filter').type('Symbol').required(true);

	dxBrazePromotionContentCard.changeFieldControl('promotionFilter', 'builtin', 'singleLine', {
		helpText: "The filter used to match corresponding Braze content cards"
	});

	// Promotions Content Cards update
	const dxPromotions = migration.editContentType('dxPromotions');

	dxPromotions
		.editField("promotions")
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxPromotionContentCard", "dxBrazePromotionContentCard"],
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
				linkContentType: ['dxMarqueeCustomTile', 'dxMarqueeBrazeTile', 'sportsMarqueePrePackTile', 'dxPromotionContentCard', 'sportsMarqueeKambiPrePackTile', 'dxBrazePromotionContentCard'],
			},
		],
	});
}) as MigrationFunction;
