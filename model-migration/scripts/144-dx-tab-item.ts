import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	const dxTabItem = migration
		.createContentType('dxTabItem')
		.name('Dx Tab Item')
		.description('Digital Experience (Dx) tab item to be used within the Dx Tab Group')
		.displayField('entryTitle');

	dxTabItem.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

	dxTabItem
		.createField('name')
		.name('Name')
		.type('Symbol')
		.localized(true)
		.required(true)
	dxTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
		helpText: 'The tab item name to be displayed on the frontend',
	});

	dxTabItem
		.createField('image')
		.name('Image')
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
	dxTabItem.changeFieldControl('image', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
		helpText: "The image/icon for the tab item",
	});

	dxTabItem
		.createField('components')
		.name('Components')
		.required(true)
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

	dxTabItem
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
	dxTabItem.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the tab item should be active',
	});

	// Updated Dx Tab Group to include Dx Tab Item
	const dxTabsGroup = migration.editContentType('dxTabsGroup');
	dxTabsGroup.editField('dxTabItems').items({
		type: 'Link',
		linkType: 'Entry',
		validations: [
			{
				linkContentType: [
                    "sportsEventListingTabItem",
                    "sportsFixtureKambiPrePackTabItem",
                    "sportsFixtureMarketsTabItem",
                    "sportsFixtureSgpTabItem",
                    "sportsFuturesTabItem",
                    "sportsNavigationTabItem",
                    "sportsParlayBuilderTabItem",
                    "sportsPersonalisedEventListingTabItems",
                    "sportsPrePackGeneratorTabItem",
                    "sportsPrePackTabItem",
                    "sportsMatchList",
					"dxTabItem"
                ],
			},
		],
	});

}) as MigrationFunction;
