import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Sports Marquee Kambi PrePack Tile
  const kambiPrePackTile = migration
    .createContentType('sportsMarqueeKambiPrePackTile')
    .name('Sports Marquee Kambi PrePack Tile')
    .description('A sports marquee pre-pack tile is used to display kambi prepacks.')
    .displayField('entryTitle');

  kambiPrePackTile
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');
  
  kambiPrePackTile
    .createField('prePackTags')
    .name('PrePack Tags')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          "in": [
            "AUTO",
            "AUTO_BUNDLED"
          ]
        }
      ]
    })
    .defaultValue({
      "en-US": [
        "AUTO", "AUTO_BUNDLED"
      ]
    })

  kambiPrePackTile.changeFieldControl('prePackTags', 'builtin', 'checkbox', {
    helpText: 'The prepack tags used for filtering prepacks',
  });

  kambiPrePackTile
    .createField('prePackIds')
    .name('prePackIds')
    .type('Array')
    .required(false)
    .items({
      type: 'Symbol',
      validations: []
    });

  // Update the Marquee Items to include the Kambi PrePack tile
	const dxMarquee = migration.editContentType('dxMarquee');
	dxMarquee.editField('marqueeItems').items({
		type: 'Link',
		linkType: 'Entry',
		validations: [
			{
				linkContentType: ['dxMarqueeCustomTile', 'dxMarqueeBrazeTile', 'sportsMarqueePrePackTile', 'dxPromotionContentCard', 'sportsMarqueeKambiPrePackTile'],
			},
		],
	});

  // Add components field to Sports Fixture SGP Tab Item
  const sgpTabItem = migration.editContentType('sportsFixtureSgpTabItem');

  sgpTabItem
    .createField('components')
    .name('components')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: [
            "dxMarquee"
          ]
        }
      ]
    });
  
}) as MigrationFunction;
