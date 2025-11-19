import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const dxMarquee = migration.editContentType('dxMarquee');
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	dxMarquee
		.createField('loop')
		.name('Continuous Loop')
		.type('Boolean')
		.required(true)
		.localized(false)
		.defaultValue({
			[LOCALE]: false
		});

	dxMarquee.changeFieldControl('loop', 'builtin', 'radio', {
		helpText: 'When a user is scrolling and reaches the last card in a carousel, select Yes so that if they keep scrolling right, the cards will loop back to the beginning.'
	});

	dxMarquee
		.createField('autoLoop')
		.name('Auto Loop')
		.type('Boolean')
		.required(true)
		.localized(false)
		.defaultValue({
			[LOCALE]: false
		});

	dxMarquee.changeFieldControl('autoLoop', 'builtin', 'radio', {
		helpText: 'When a user is not interacting with the carousel, select Yes if you want the cards to automatically cycle to show the user more content. Select YES in continuous loop too if you want this functionality.'
	});

	dxMarquee
		.createField('loopTimer')
		.name('Auto Loop Timer')
		.type('Number')
		.required(true)
		.localized(false)
		.defaultValue({
			[LOCALE]: 5.00
		})
		.validations([
			{
				range: {
					min: 0
				}
			}
		]);

	dxMarquee.changeFieldControl('loopTimer', 'builtin', 'numberEditor', {
			helpText: 'The length of time that passes with a user not interacting with the screen before a carousel starts to auto cycle. Default value is 5 seconds.'
		});

	// apply default values to existing entries
	migration.transformEntries({
		contentType: 'dxMarquee',
		from: ['loop', 'autoLoop', 'loopTimer'],
		to: ['loop', 'autoLoop', 'loopTimer'],
		transformEntryForLocale: async () => {
			return {
				loop: false,
				autoLoop: false,
				loopTimer: 5.00
			}
		}
	});
	
}) as MigrationFunction; 
