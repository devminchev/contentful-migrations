import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	const sportsMarqueePrePackTile = migration.editContentType('sportsMarqueePrePackTile');

	sportsMarqueePrePackTile
		.editField('queryType')
		.validations(
			[
				{
					"in": [
						"popularPrePacks",
						"recommendedParlayPrePacks",
						"recommendedSGPPrePacks",
						"recommendedSGPPrePacksForFixture",
						"recommendedSGPAndParlayPrePacks"
					]
				}
			],
		);

	sportsMarqueePrePackTile
		.createField('statuses')
		.name('Statuses')
		.type('Array')
		.items({
			type: 'Symbol',
			validations: [
				{
					in: ['NOT_STARTED', 'STARTED', 'FINISHED'],
				}
			],
		})
		.defaultValue({
			[LOCALE]: [
				"NOT_STARTED",
				"STARTED"
			]
		});
	sportsMarqueePrePackTile.changeFieldControl('statuses', 'builtin', 'checkbox', {
		helpText: "The accepted statuses of the fixtures within the recommended SGP and Parlay Pre Packs query."
	});

}) as MigrationFunction;
