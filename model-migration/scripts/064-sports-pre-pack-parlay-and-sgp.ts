import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Sports Marquee PrePack Tile
  const marqueePrePackTile = migration
    .createContentType('sportsMarqueePrePackTile')
    .name('Sports Marquee PrePack Tile')
    .description('A sports marquee pre-pack tile is used to display popular pre-packs. The number of pre-packs and legs are configurable.')
    .displayField('entryTitle');

  marqueePrePackTile
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');
  
  marqueePrePackTile
    .createField('prePackType')
    .name('prePackType')
    .type('Symbol')
    .required(true);

  marqueePrePackTile
    .createField('count')
    .name('count')
    .type('Integer')
    .required(true)
    .validations(
			[
				{
					"range": {
            "min": 2,
						"max": 20
					}
				}
			]
		);

  marqueePrePackTile
    .createField('legs')
    .name('legs')
    .type('Integer')
    .required(true)
    .validations(
			[
				{
					"range": {
            "min": 2,
						"max": 10
					}
				}
			]
		);

  // Update the Marquee Items to include the PrePack tile
	const dxMarquee = migration.editContentType('dxMarquee');
	dxMarquee.editField('marqueeItems').items({
		type: 'Link',
		linkType: 'Entry',
		validations: [
			{
				linkContentType: ['dxMarqueeCustomTile', 'dxMarqueeBrazeTile', 'sportsMarqueePrePackTile'],
			},
		],
	});

  // Generate the new tab item 
  //Sports Personalised Group Override
  const groupOverride = migration
    .createContentType('sportsPersonalisedGroupOverride')
    .name('Sports Personalised Group Override')
    .description('A sports personalised group override can be used to insert or change the display order of recommended leagues e.g. using an override with id of \'american_football/nfl\' and sortOrder of 1 would ensure an NFL tab is always displayed first whether recommended or not.')
    .displayField('entryTitle');

  groupOverride
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  groupOverride
    .createField('path')
    .name('path')
    .type('Symbol')
    .required(true);

  groupOverride
    .createField('sortOrder')
    .name('sortOrder')
    .type('Integer')
    .required(true);

  //Sports PrePack Tab Group
  const tabGroup = migration
    .createContentType('sportsPrePackTabGroup')
    .name('Sports PrePack Tab Group')
    .description('A sports pre-pack tab group is used to display a set of recommended pre-packs for recommended leagues i.e. NFL, NBA, MLB. The number of recommended leagues, fixtures, bets and legs are all configurable.')
    .displayField('entryTitle');

  tabGroup
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  tabGroup
    .createField('name')
    .name('name')
    .type('Symbol')
    .required(true);

  tabGroup
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
        }
      ],
    })
    .defaultValue({
      "en-US": [
        "showWhenLoggedIn",
        "showWhenLoggedOut"
      ]
    });
  tabGroup.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Dx tabs group should be active',
  });
  
  tabGroup
    .createField('prePackType')
    .name('prePackType')
    .type('Symbol')
    .required(true);

  tabGroup
    .createField('tabItemCount')
    .name('tabItemCount')
    .type('Integer')
    .required(true);

  tabGroup
    .createField('sportIds')
    .name('sportIds')
    .type('Array')
    .required(false)
    .items({
      type: 'Symbol',
      validations: []
    });

  tabGroup
    .createField('overrides')
    .name('overrides')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: [
            "sportsPersonalisedGroupOverride"
          ]
        }
      ]
    });

  tabGroup
    .createField('prePackCount')
    .name('prePackCount')
    .type('Integer')
    .required(true)
    .validations(
			[
				{
					"range": {
            "min": 2,
						"max": 20
					}
				}
			]
		);

  tabGroup
    .createField('legs')
    .name('legs')
    .type('Integer')
    .required(true)
    .validations(
			[
				{
					"range": {
            "min": 2,
						"max": 10
					}
				}
			]
		);

  tabGroup
    .createField('numOfFixtures')
    .name('numOfFixtures')
    .type('Integer')
    .required(false)
    .validations(
			[
				{
					"range": {
            "min": 2,
						"max": 100
					}
				}
			]
		);

  // Sports PrePack Tab Item
  const prePackTabItem = migration
    .createContentType('sportsPrePackTabItem')
    .name('Sports PrePack Tab Item')
    .description('A sports pre-pack tab item is used to display a set of popular pre-packs and a set of recommended pre-packs for recommended leagues i.e. NFL, NBA, MLB.')
    .displayField('entryTitle');
    
  prePackTabItem
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  prePackTabItem
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true);

  prePackTabItem
    .createField('components')
    .name('components')
    .type('Array')
    .required(true)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: [
            "dxMarquee", "sportsPrePackTabGroup"
          ]
        }
      ]
    });

  // Update the Tabs Group to include the Sports PrePack Tab Item
  const dxTabsGroup = migration.editContentType('dxTabsGroup');
  dxTabsGroup.editField('dxTabItems').items({
    type: 'Link',
    linkType: 'Entry',
    validations: [
      {
        linkContentType: [
          "sportsNavigationTabItem", "sportsEventListingTabItem", "sportsPrePackTabItem"
        ],
      },
    ],
  });

}) as MigrationFunction;