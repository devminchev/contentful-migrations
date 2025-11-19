import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  // Sports Marquee Single Selection Tile
  const sportsMarqueeSingleSelectionTile = migration
    .createContentType('sportsMarqueeSingleSelectionTile')
    .name('Sports Marquee Single Selection Tile')
    .description('Sports Marquee Single Selection Tile used across Sportsbook within the Sports Marquee.')
    .displayField('entryTitle');

  sportsMarqueeSingleSelectionTile.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsMarqueeSingleSelectionTile.createField('fixtureId').name('Fixture Id').type('Symbol').required(true);
  sportsMarqueeSingleSelectionTile.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
    helpText: 'The Fixture Id the selection belongs to.',
  });

  sportsMarqueeSingleSelectionTile.createField('marketTypeId').name('Market Type Id').type('Symbol').required(true);
  sportsMarqueeSingleSelectionTile.changeFieldControl('marketTypeId', 'builtin', 'singleLine', {
    helpText: 'The Market Type Id the selection belongs to.',
  });

  sportsMarqueeSingleSelectionTile.createField('marketId').name('Market Id').type('Symbol');
  sportsMarqueeSingleSelectionTile.changeFieldControl('marketId', 'builtin', 'singleLine', {
    helpText:
      'The Market Id the selection belongs to. This can be optional but it is recommended to always try and fill it in as it could help better narrow down the market.',
  });

  sportsMarqueeSingleSelectionTile.createField('selectionId').name('Selection Id').type('Symbol').required(true);
  sportsMarqueeSingleSelectionTile.changeFieldControl('selectionId', 'builtin', 'singleLine', {
    helpText: 'The Id of the selection.',
  });

  sportsMarqueeSingleSelectionTile.createField('sportId').name('Sport Id').type('Symbol');
  sportsMarqueeSingleSelectionTile.changeFieldControl('sportId', 'builtin', 'singleLine', {
    helpText: 'The Sport Id the fixture belongs to.',
  });

  sportsMarqueeSingleSelectionTile.createField('regionId').name('Region Id').type('Symbol');
  sportsMarqueeSingleSelectionTile.changeFieldControl('regionId', 'builtin', 'singleLine', {
    helpText: 'The Region Id the fixture belongs to.',
  });

  sportsMarqueeSingleSelectionTile.createField('competitionId').name('Competition Id').type('Symbol');
  sportsMarqueeSingleSelectionTile.changeFieldControl('competitionId', 'builtin', 'singleLine', {
    helpText: 'The Competition Id the fixture belongs to.',
  });

  sportsMarqueeSingleSelectionTile.createField('image').name('Image').type('Text').localized(true);
  sportsMarqueeSingleSelectionTile.changeFieldControl('image', 'builtin', 'singleLine', {
    helpText:
      'To be used as a fallback image when participants logos are not available. It can be a relative or absolute path to the CDN image.',
  });

  sportsMarqueeSingleSelectionTile
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
        },
      ],
    });
  sportsMarqueeSingleSelectionTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Marquee Single Selection Tile should be active',
  });

  // Sports Marquee Single Market Tile
  const sportsMarqueeSingleMarketTile = migration
    .createContentType('sportsMarqueeSingleMarketTile')
    .name('Sports Marquee Single Market Tile')
    .description('Sports Marquee Single Market Tile used across Sportsbook within the Sports Marquee.')
    .displayField('entryTitle');

  sportsMarqueeSingleMarketTile.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsMarqueeSingleMarketTile.createField('fixtureId').name('Fixture Id').type('Symbol').required(true);
  sportsMarqueeSingleMarketTile.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
    helpText: 'The Fixture Id the market belongs to.',
  });

  sportsMarqueeSingleMarketTile.createField('marketTypeId').name('Market Type Id').type('Symbol').required(true);
  sportsMarqueeSingleMarketTile.changeFieldControl('marketTypeId', 'builtin', 'singleLine', {
    helpText: 'The Type Id of the market.',
  });

  sportsMarqueeSingleMarketTile.createField('marketId').name('Market Id').type('Symbol');
  sportsMarqueeSingleMarketTile.changeFieldControl('marketId', 'builtin', 'singleLine', {
    helpText:
      'The Id of the market. This can be optional but it is recommended to always try and fill it in as it could help better narrow down the market.',
  });

  sportsMarqueeSingleMarketTile.createField('sportId').name('Sport Id').type('Symbol');
  sportsMarqueeSingleMarketTile.changeFieldControl('sportId', 'builtin', 'singleLine', {
    helpText: 'The sport Id the fixture belongs to.',
  });

  sportsMarqueeSingleMarketTile.createField('regionId').name('Region Id').type('Symbol');
  sportsMarqueeSingleMarketTile.changeFieldControl('regionId', 'builtin', 'singleLine', {
    helpText: 'The region Id the fixture belongs to.',
  });

  sportsMarqueeSingleMarketTile.createField('competitionId').name('Competition Id').type('Symbol');
  sportsMarqueeSingleMarketTile.changeFieldControl('competitionId', 'builtin', 'singleLine', {
    helpText: 'The competition Id the fixture belongs to.',
  });

  sportsMarqueeSingleMarketTile
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
        },
      ],
    });
  sportsMarqueeSingleMarketTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Marquee Single Market Tile should be active',
  });

  // Sports Marquee Single Market Tile
  const sportsMarqueeSixPackTile = migration
    .createContentType('sportsMarqueeSixPackTile')
    .name('Sports Marquee Six Pack Tile')
    .description('Sports Marquee Six Pack Tile used across Sportsbook within the Sports Marquee.')
    .displayField('entryTitle');

  sportsMarqueeSixPackTile.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsMarqueeSixPackTile.createField('fixtureId').name('Fixture Id').type('Symbol').required(true);
  sportsMarqueeSixPackTile.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
    helpText: 'The fixture Id the market belongs to.',
  });

  sportsMarqueeSixPackTile.createField('marketTypeIds').name('Market Type Ids').type('Array').required(true).items({
    type: 'Symbol',
    validations: [],
  });
  sportsMarqueeSixPackTile.changeFieldControl('marketTypeIds', 'builtin', 'tagEditor', {
    helpText: 'In the case of multiple markets with the same Type Id, entering the Type Id once is sufficient.',
  });

  sportsMarqueeSixPackTile.createField('marketIds').name('Market Ids').type('Array').items({
    type: 'Symbol',
    validations: [],
  });
  sportsMarqueeSixPackTile.changeFieldControl('marketIds', 'builtin', 'tagEditor', {
    helpText:
      'This can be optional but it is recommended to always try and fill it in as it could help better narrow down the market.',
  });

  sportsMarqueeSixPackTile.createField('sportId').name('Sport Id').type('Symbol');
  sportsMarqueeSixPackTile.changeFieldControl('sportId', 'builtin', 'singleLine', {
    helpText: 'The sport Id the fixture belongs to.',
  });

  sportsMarqueeSixPackTile.createField('regionId').name('Region Id').type('Symbol');
  sportsMarqueeSixPackTile.changeFieldControl('regionId', 'builtin', 'singleLine', {
    helpText: 'The region Id the fixture belongs to.',
  });

  sportsMarqueeSixPackTile.createField('competitionId').name('Competition Id').type('Symbol');
  sportsMarqueeSixPackTile.changeFieldControl('competitionId', 'builtin', 'singleLine', {
    helpText: 'The competition Id the fixture belongs to.',
  });

  sportsMarqueeSixPackTile
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
        },
      ],
    });
  sportsMarqueeSixPackTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Marquee Six Pack Tile should be active',
  });

  // Update the existing Sports Marquee Collection to link to the newly created Sports Marquee Market And Selection Tiles
  const sportsMarquee = migration.editContentType('sportsMarquee');

  sportsMarquee.editField('sportsMarqueeItems').items({
    type: 'Link',
    linkType: 'Entry',
    validations: [
      {
        linkContentType: [
          'sportsMarqueeCustomTile',
          'sportsMarqueeJudoTile',
          'sportsMarqueeSingleSelectionTile',
          'sportsMarqueeSingleMarketTile',
          'sportsMarqueeSixPackTile',
        ],
      },
    ],
  });
}) as MigrationFunction;
