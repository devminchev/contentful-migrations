import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	const dxTabItem = migration.editContentType('dxTabItem');

	dxTabItem.editField('components').items({
		type: 'Link',
		linkType: 'Entry',
		validations: [
			{
				linkContentType: [
					"dxMarquee",
					"sportsPersonalisedFixtures",
					"dxContent"
				],
			},
		],
	});

}) as MigrationFunction;
