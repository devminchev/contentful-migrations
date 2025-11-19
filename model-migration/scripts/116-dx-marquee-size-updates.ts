import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const dxMarquee = migration.editContentType('dxMarquee');
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	dxMarquee
		.createField('size')
		.name('Size')
		.type('Symbol')
		.required(true)
		.validations([
			{
				"in": [
					"condensed",
					"small",
					"medium",
					"large"
				]
			}
		])
		.defaultValue({
			[LOCALE]: "small"
		});

	dxMarquee.changeFieldControl('size', 'builtin', 'dropdown', {
		helpText: "Determines the size the marquee items in the collection should be displayed at."
	})

	dxMarquee.moveField('size').afterField('entryTitle');
	dxMarquee.moveField('header').afterField('size');
	
	// Sets the default value for the new size property for any existing marquee entries.
	migration.transformEntries({
		contentType: 'dxMarquee',
		from: ['size'],
		to: ['size'],
		transformEntryForLocale: async () => {
			return {
				size: 'small'
			}
		}
	});
	
}) as MigrationFunction;
