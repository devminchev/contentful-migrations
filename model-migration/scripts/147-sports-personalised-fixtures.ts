import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	const sportsPersonalisedFixtures = migration
		.createContentType('sportsPersonalisedFixtures')
		.name('Sports Personalised Fixtures')
		.description('Digital Experience (Dx) component for creating sports personalised fixtures')
		.displayField('entryTitle');

	sportsPersonalisedFixtures.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

	sportsPersonalisedFixtures
		.createField('title')
		.name('Title')
		.type('Symbol')
		.localized(true)
		.required(true)
	sportsPersonalisedFixtures.changeFieldControl('title', 'builtin', 'singleLine', {
		helpText: 'The title to be displayed for the personalised fixtures collection. For the localised fixtures, a {{jurisdiction}} variable can be used that will be populated on the Config Service with the correct jurisdiction name.',
	});

	sportsPersonalisedFixtures
		.createField('queryType')
		.name('Query Type')
		.type('Symbol')
		.required(true)
		.validations(
			[
				{
					"in": [
						"recommendedFixtures",
						"trendingFixtures"
					]
				}
			],
		)
		.defaultValue({
			[LOCALE]: 'recommendedFixtures'
		});

	sportsPersonalisedFixtures
		.createField('limit')
		.name('Limit')
		.type('Integer')
		.required(true)
		.validations([
			{
				"range": {
					"min": 1,
					"max": 10
				}
			}
		])
		.defaultValue({
			[LOCALE]: 1
		})
	sportsPersonalisedFixtures.changeFieldControl('limit', 'builtin', 'numberEditor', {
		helpText: 'The maximum number of fixtures to be returned. Needs to be between 1 and 10.'
	});

	sportsPersonalisedFixtures
		.createField('daysDateRange')
		.name('Days Date Range')
		.type('Integer')
		.required(true)
		.validations([
			{
				"range": {
					"min": 1,
					"max": 7
				}
			}
		])
		.defaultValue({
			[LOCALE]: 1
		})
	sportsPersonalisedFixtures.changeFieldControl('daysDateRange', 'builtin', 'numberEditor', {
		helpText: 'The number of days to retrieve fixtures for. Maximum of 7 days into the future from current date.'
	});

	sportsPersonalisedFixtures.createField('orderBy')
		.name('Order By')
		.type('Array')
		.required(true)
		.items({
			type: "Symbol",
			validations: [
				{
					"in": [
						"SPORT_CONFIDENCE",
						"REGION_CONFIDENCE",
						"COMPETITION_CONFIDENCE",
						"FIXTURE_START_TIME"
					]
				}
			]
		})
		.defaultValue({
			[LOCALE]: ["SPORT_CONFIDENCE", "REGION_CONFIDENCE", "COMPETITION_CONFIDENCE", "FIXTURE_START_TIME"]
		});
		
	sportsPersonalisedFixtures.changeFieldControl('orderBy', 'builtin', 'tagEditor', {
		helpText: 'The order to return the fixtures in based on VAIX confidence and/or fixture start time. Available options: SPORT_CONFIDENCE, REGION_CONFIDENCE, COMPETITION_CONFIDENCE, FIXTURE_START_TIME.'
	});

	sportsPersonalisedFixtures
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
	sportsPersonalisedFixtures.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the sports personalised fixtures should be active',
	});

	// Add the Sports Personalised Fixtures as a component option for the Dx Tab Item
	const dxTabItem = migration.editContentType('dxTabItem');

	dxTabItem.editField('components').items({
        type: 'Link',
        linkType: 'Entry',
        validations: [
            {
                linkContentType: [
                    "dxMarquee",
					"sportsPersonalisedFixtures"
                ],
            },
        ],
    });	
}) as MigrationFunction;
