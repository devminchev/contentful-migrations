import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";
	// Sports Marquee Single Market Tile
	const sportsMarqueeScoreboardTile = migration.editContentType('sportsMarqueeScoreboardTile');

	sportsMarqueeScoreboardTile
		.createField('status')
		.name('Status')
		.type('Array')
		.localized(false)
		.required(true)
		.items({
			type: 'Symbol',
			validations: [
				{
					in: ['showPreGame', 'showLive'],
				},
			],
		})
		.defaultValue({
			[LOCALE]: ['showPreGame']
		});
	sportsMarqueeScoreboardTile.changeFieldControl('status', 'builtin', 'checkbox', {
		helpText: 'Determines whether a tile can transition to live (if available) or just display pre-game, or vice-versa, or both.',
	});

	sportsMarqueeScoreboardTile.createField('description').name('Description').type('Symbol').localized(true);
	sportsMarqueeScoreboardTile.changeFieldControl('description', 'builtin', 'singleLine', {
		helpText:
			'Provides the ability to override the selection name as these can sometimes be incorrect or too long from the Sports data provider.',
	});

	sportsMarqueeScoreboardTile.createField('backgroundImage')
		.name('Background Image')
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
	sportsMarqueeScoreboardTile.changeFieldControl('backgroundImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
		helpText: "Provides a background image for the scoreboard tile, without affecting any participants logos. If no image is provided, it will fallback to one of the light, dark or glass tile designs.",
	});

	sportsMarqueeScoreboardTile.moveField('status').afterField('marketSpecifierId');
	sportsMarqueeScoreboardTile.moveField('description').afterField('status');
	sportsMarqueeScoreboardTile.moveField('backgroundImage').afterField('description');

}) as MigrationFunction;
