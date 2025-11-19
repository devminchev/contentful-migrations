import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	// Digital Experience Link
	const dxLink = migration
		.createContentType('dxLink')
		.name('Dx Link')
		.description(
			'Digital Experience (Dx) Link that can be managed and re-used across Dx products, including Dx Quick Links, Dx Marquees, etc.'
		)
		.displayField('entryTitle');

	dxLink.createField('entryTitle').name('entryTitle').type('Symbol');

	dxLink.createField('title').name('Title').type('Symbol').localized(true);
	dxLink.changeFieldControl('title', 'builtin', 'singleLine', {
		helpText: 'Title of the Digital Experience (Dx) Link',
	});

	dxLink.createField('url').name('Url').type('Symbol').localized(true);
	dxLink.changeFieldControl('url', 'builtin', 'singleLine', {
		helpText: 'Full url to the destination',
	});

	dxLink.createField('image').name('Image').type('Text').localized(true);
	dxLink.changeFieldControl('image', 'builtin', 'singleLine', {
		helpText: 'Relative or Absolute path to Image in CDN',
	});

	dxLink.createField('isNew').name('Is New').type('Boolean').localized(false)
		.defaultValue({
			'en-US': false,
		});

	dxLink.changeFieldControl('isNew', 'builtin', 'radio', {
		helpText: 'Whether to assign \'Is New\' icon to the Digital Experience (Dx) Link',
	});

	dxLink
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
	dxLink.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the Digital Experience (Dx) Link should be active',
	});

	// Digital Experience Quick Links
	const dxQuickLinks = migration
		.createContentType('dxQuickLinks')
		.name('Dx Quick Links')
		.description('A collection of Digital Experience (Dx) Quick Links')
		.displayField('entryTitle');

	dxQuickLinks.createField('entryTitle').name('entryTitle').type('Symbol');

	dxQuickLinks
		.createField('type')
		.name('Type')
		.type('Text')
		.localized(false)
		.required(false)
		.validations([
			{
				in: ['carousel', 'grid', 'list'],
			},
		])
		.defaultValue({
			'en-US': 'carousel',
		});

	dxQuickLinks.changeFieldControl('type', 'builtin', 'dropdown', {
		helpText: 'This will determine the layout for the Digital Experience (Dx) Quick Links',
	});

	dxQuickLinks
		.createField('dxLinks')
		.name('Dx Links')
		.type('Array')
		.localized(false)
		.required(false)
		.items({
			type: 'Link',
			linkType: 'Entry',
			validations: [
				{
					linkContentType: ['dxLink'],
				},
			],
		});

	// Digital Experience Marquee
	const dxMarquee = migration
		.createContentType('dxMarquee')
		.name('Dx Marquee')
		.description('A collection of Digital Experience (Dx) Marquee items')
		.displayField('entryTitle');

	dxMarquee.createField('entryTitle').name('entryTitle').type('Symbol');

	dxMarquee
		.createField('marqueeItems')
		.name('Marquee Items')
		.type('Array')
		.localized(false)
		.required(false)
		.items({
			type: 'Link',
			linkType: 'Entry',
			validations: [
				{
					linkContentType: ['dxMarqueeCustomTile'],
				},
			],
		});

	// Digital Experience Marquee Custom Tile
	const dxMarqueeCustomTile = migration
		.createContentType('dxMarqueeCustomTile')
		.name('Dx Marquee Custom Tile')
		.description('Digital Experience (Dx) Custom Tile used across Digital Experience products')
		.displayField('entryTitle');

	dxMarqueeCustomTile.createField('entryTitle').name('entryTitle').type('Symbol');

	dxMarqueeCustomTile.createField('title').name('Title').type('Symbol').localized(true);
	dxMarqueeCustomTile.changeFieldControl('title', 'builtin', 'singleLine', {
		helpText: 'Marquee Custom Tile Title',
	});

	dxMarqueeCustomTile.createField('body').name('Body').type('Text').localized(true);
	dxMarqueeCustomTile.changeFieldControl('body', 'builtin', 'multipleLine', {
		helpText: 'Marquee Custom Tile tag line',
	});

	dxMarqueeCustomTile.createField('url').name('Url').type('Symbol').localized(true);
	dxMarqueeCustomTile.changeFieldControl('url', 'builtin', 'singleLine', {
		helpText:
			"Full url to the destination, only to be used if buttons aren't desired, and want to treat the whole sports marquee custom tile as a clickable area",
	});

	dxMarqueeCustomTile.createField('image').name('Image').type('Text').localized(true);
	dxMarqueeCustomTile.changeFieldControl('image', 'builtin', 'singleLine', {
		helpText: 'Relative or Absolute path to image in CDN (later to be replaced with DAM)',
	});

	dxMarqueeCustomTile
		.createField('buttons')
		.name('Buttons')
		.type('Array')
		.localized(false)
		.required(false)
		.items({
			type: 'Link',
			linkType: 'Entry',
			validations: [
				{
					linkContentType: ['dxLink'],
				},
			],
		});

	dxMarqueeCustomTile
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
	dxMarqueeCustomTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the Sports Link should be active',
	});

	// Digital Experience Placeholder
	const dxPlaceholder = migration
		.createContentType('dxPlaceholder')
		.name('Dx Placeholder')
		.description('Digital Experience (Dx) generic component that can be used when there are no explicitly defined models')
		.displayField('entryTitle');

	dxPlaceholder.createField('entryTitle').name('Entry Title').type('Symbol');

	dxPlaceholder.createField('type').name('Type').type('Symbol').required(true).localized(false);
	dxPlaceholder.changeFieldControl('type', 'builtin', 'singleLine', {
		helpText: 'The type of the placeholder component which can be interpreted without needing to look inside the props',
	});

	dxPlaceholder.createField('props').name('Props').type('Object');
	dxPlaceholder.changeFieldControl('props', 'builtin', 'objectEditor', {
		helpText: 'Generic Json containing all data required for the placeholder component to function as desired',
	});

	dxPlaceholder
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
	dxPlaceholder.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the Digital Experience (Dx) Placeholder component should be active',
	});

	// Digital Experience View
	const dxView = migration
		.createContentType("dxView")
		.name("Dx View")
		.description("A collection of Digital Experience (Dx) View sections")
		.displayField("entryTitle");

	dxView.createField("entryTitle").name("entryTitle").type("Symbol");

	dxView
		.createField("key")
		.name("Key")
		.type("Symbol")
		.required(true)
		.localized(false);

	dxView.createField("path").name("Path").type("Symbol");
	dxView.changeFieldControl("path", "builtin", "singleLine", {
		helpText: "Used to determine which group or fixture to return. Only required for the 'group' and 'fixture' views",
	});

	dxView
		.createField("topContent")
		.name("Top Content")
		.type("Array")
		.localized(false)
		.required(false)
		.validations(
			[
				{
					"size": {
						"max": 5
					}
				}
			]
		)
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxQuickLinks", "dxMarquee", "dxPlaceholder"],
				},
			],
		});
	dxView.changeFieldControl("topContent", "builtin", "entryLinksEditor", {
		helpText:
			"Used to determine what components will display in the top content section of the view",
	});

	dxView
		.createField("leftNavigationContent")
		.name("Left Navigation Content")
		.type("Array")
		.localized(false)
		.required(false)
		.validations(
			[
				{
					"size": {
						"max": 5
					}
				}
			]
		)
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxQuickLinks", "dxMarquee", "dxPlaceholder"],
				},
			],
		});
	dxView.changeFieldControl(
		"leftNavigationContent",
		"builtin",
		"entryLinksEditor",
		{
			helpText:
				"Used to determine what components will display in the left navigation content section of the view",
		}
	);

	dxView
		.createField("primaryContent")
		.name("Primary Content")
		.type("Array")
		.localized(false)
		.required(false)
		.validations(
			[
				{
					"size": {
						"max": 5
					}
				}
			]
		)
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxQuickLinks", "dxMarquee", "dxPlaceholder"],
				},
			],
		});
	dxView.changeFieldControl(
		"primaryContent",
		"builtin",
		"entryLinksEditor",
		{
			helpText:
				"Used to determine what components will display in the primary content section of the view",
		}
	);

	dxView
		.createField("secondaryContent")
		.name("Secondary Content")
		.type("Array")
		.localized(false)
		.required(false)
		.validations(
			[
				{
					"size": {
						"max": 5
					}
				}
			]
		)
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxQuickLinks", "dxMarquee", "dxPlaceholder"],
				},
			],
		});
	dxView.changeFieldControl(
		"secondaryContent",
		"builtin",
		"entryLinksEditor",
		{
			helpText:
				"Used to determine what components will display in the secondary content section of the view",
		}
	);

	dxView
		.createField("primaryEmptyContent")
		.name("Primary Empty Content")
		.type("Array")
		.localized(false)
		.required(false)
		.validations(
			[
				{
					"size": {
						"max": 5
					}
				}
			]
		)
		.items({
			type: "Link",
			linkType: "Entry",
			validations: [
				{
					linkContentType: ["dxQuickLinks", "dxMarquee", "dxPlaceholder"],
				},
			],
		});
	dxView.changeFieldControl(
		"primaryEmptyContent",
		"builtin",
		"entryLinksEditor",
		{
			helpText:
				"Used to determine what components should display in the primary content section of the view if no external data is available",
		}
	);

	dxView
		.createField("platform")
		.name("Platform")
		.type("Symbol")
		.localized(false)
		.required(false)
		.validations([
			{
				in: ["WEB", "ANDROID", "IOS"]
			},
		]);

	dxView.changeFieldControl("platform", "builtin", "radio", {
		helpText: "The platform where the Digital Experience (Dx) View should be active",
	});

	dxView
		.createField("brand")
		.name("Brand")
		.type("Link")
		.localized(false)
		.required(true)
		.validations([
			{
				linkContentType: ["dxBrand"],
			},
		])
		.linkType("Entry");
	dxView.changeFieldControl("brand", "builtin", "entryLinkEditor", {
		helpText: "The brand where the Digital Experience (Dx) View should be active",
	});

	dxView
		.createField("jurisdiction")
		.name("Jurisdiction")
		.type("Link")
		.localized(false)
		.required(false)
		.validations([
			{
				linkContentType: ["dxJurisdiction"],
			},
		])
		.linkType("Entry");
	dxView.changeFieldControl("jurisdiction", "builtin", "entryLinkEditor", {
		helpText: "The jurisdiction where the Digital Experience (Dx) View should be active",
	});
}) as MigrationFunction;
