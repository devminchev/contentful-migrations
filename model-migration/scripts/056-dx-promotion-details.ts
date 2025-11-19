import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	const dxPromotionDetails = migration
		.createContentType("dxPromotionDetails")
		.name("Dx Promotion Details")
		.description("Digital Experience (Dx) Promotional Details to be used across Digital Experience products")
		.displayField("entryTitle");

	dxPromotionDetails.createField("entryTitle").name("entryTitle").type("Symbol");

	dxPromotionDetails
		.createField("promotionIdentifier")
		.name("Promotion Identifier")
		.type("Symbol")
		.localized(false);
	dxPromotionDetails.changeFieldControl('promotionIdentifier', 'builtin', 'singleLine', {
		helpText: 'This represents the unique identifier for the promotion, usually available from other tooling options like Braze'
	});

	dxPromotionDetails.createField('optIn').name('Opt In').type('Boolean').required(true).localized(false).defaultValue({
		'en-US': false
	});
	dxPromotionDetails.changeFieldControl('optIn', 'builtin', 'radio', {
		helpText: 'Used to determine if the promotion requires the user to opt in. This will hide or show the Opt In CTA on the frontends'
	});

	dxPromotionDetails.createField('image').name('Image').type('Text').localized(true);
	dxPromotionDetails.changeFieldControl('image', 'builtin', 'singleLine', {
		helpText: 'Relative or Absolute path to Image in CDN',
	});

	dxPromotionDetails
		.createField('promotionCta')
		.name('Promotion CTA')
		.type('Link')
		.localized(false)
		.required(false)
		.validations([
			{
				linkContentType: ['dxLink'],
			},
		])
		.linkType('Entry');
	dxPromotionDetails.changeFieldControl('promotionCta', 'builtin', 'entryLinkEditor', {
		helpText: 'To be used when the user needs to be redirected to other pages of the application. E.g. a \'Play Now\' CTA that would redirect to \'/casino\''
	});

	dxPromotionDetails.createField('title').name('Title').type('Text').localized(true);
	dxPromotionDetails.changeFieldControl('title', 'builtin', 'singleLine', {
		helpText: 'The title for the promotion',
	});

	dxPromotionDetails
		.createField('description')
		.name('Description')
		.type('RichText')
		.localized(true)
		.validations([
			{
				"enabledMarks": [
					"bold",
					"italic",
					"underline",
					"code",
					"superscript",
					"subscript"
				],
				"message": "Only bold, italic, underline, code, superscript, and subscript marks are allowed"
			},
			{
				"enabledNodeTypes": [
					"heading-1",
					"heading-2",
					"heading-3",
					"heading-4",
					"heading-5",
					"heading-6",
					"ordered-list",
					"unordered-list",
					"hr",
					"blockquote",
					"table",
					"hyperlink"
				],
				"message": "Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, table, and link to Url nodes are allowed"
			},
			{
				"nodes": {}
			}
		]);
	dxPromotionDetails.changeFieldControl('description', 'builtin', 'richTextEditor', {
		helpText: 'The description for the promotion'
	})

	dxPromotionDetails
		.createField('terms')
		.name('Terms')
		.type('RichText')
		.localized(true)
		.validations([
			{
				"enabledMarks": [
					"bold",
					"italic",
					"underline",
					"code",
					"superscript",
					"subscript"
				],
				"message": "Only bold, italic, underline, code, superscript, and subscript marks are allowed"
			},
			{
				"enabledNodeTypes": [
					"heading-1",
					"heading-2",
					"heading-3",
					"heading-4",
					"heading-5",
					"heading-6",
					"ordered-list",
					"unordered-list",
					"hr",
					"blockquote",
					"table",
					"hyperlink"
				],
				"message": "Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, table, and link to Url nodes are allowed"
			},
			{
				"nodes": {}
			}
		]);
	dxPromotionDetails.changeFieldControl('terms', 'builtin', 'richTextEditor', {
		helpText: 'The terms for the promotion'
	});

	// 
	const dxView = migration.editContentType('dxView');
	dxView.editField('primaryContent').items({
		type: "Link",
		linkType: "Entry",
		validations: [
			{
				linkContentType: ["dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxPromotionDetails"],
			}
		]
	});

}) as MigrationFunction;
