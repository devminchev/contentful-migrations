import { MigrationFunction } from 'contentful-migration';

// Run script only after config-service is not listening to these models
export = ((migration) => {
	migration.deleteContentType('sportsMarqueeSingleSelectionTile');
	migration.deleteContentType('sportsMarqueeScoreboardTile');
	migration.deleteContentType('sportsMarqueeSixPackTile');
	migration.deleteContentType('sportsMarqueeSpecialsBoostsTile');

  const dxMarquee = migration.editContentType('dxMarquee');
	dxMarquee.editField('marqueeItems').items({
		type: 'Link',
		linkType: 'Entry',
		validations: [
			{
				linkContentType: [
					'dxMarqueeCustomTile',
					'dxMarqueeBrazeTile',
					'sportsMarqueePrePackTile',
					'dxPromotionContentCard',
					'sportsMarqueeKambiPrePackTile',
					'dxBrazePromotionContentCard',
					'dxPlayerRewardsTile',
					'sportsMarqueeSpecialsPrePackTile',
					'sportsMarqueeMarketAndSelectionTile'
				]
			}
		]
	});
}) as MigrationFunction;
