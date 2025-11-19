import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const sportsMarqueePriceBoostTile = migration
    .createContentType('sportsMarqueePriceBoostTile')
    .name('Sports Marquee Price Boost Tile')
    .description('Sports Marquee Price Boost Tile used across Sportsbook within the Sports Marquee.')
    .displayField('entryTitle');

  sportsMarqueePriceBoostTile.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsMarqueePriceBoostTile.createField('fixtureId').name('Fixture Id').type('Symbol').required(true);
  sportsMarqueePriceBoostTile.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
    helpText: 'The Fixture Id the selection belongs to.',
  });

  sportsMarqueePriceBoostTile.createField('marketTypeId').name('Market Type Id').type('Symbol').required(true);
  sportsMarqueePriceBoostTile.changeFieldControl('marketTypeId', 'builtin', 'singleLine', {
    helpText: 'The Market Type Id the selection belongs to.',
  });

  sportsMarqueePriceBoostTile.createField('marketId').name('Market Id').type('Symbol');
  sportsMarqueePriceBoostTile.changeFieldControl('marketId', 'builtin', 'singleLine', {
    helpText:
      'The Market Id the selection belongs to. This can be optional but it is recommended to always try and fill it in as it could help better narrow down the market.',
  });

  sportsMarqueePriceBoostTile.createField('selectionId').name('Selection Id').type('Symbol').required(true);
  sportsMarqueePriceBoostTile.changeFieldControl('selectionId', 'builtin', 'singleLine', {
    helpText: 'The Id of the selection.',
  });

  sportsMarqueePriceBoostTile.createField('sportId').name('Sport Id').type('Symbol');
  sportsMarqueePriceBoostTile.changeFieldControl('sportId', 'builtin', 'singleLine', {
    helpText: 'The Sport Id the fixture belongs to.',
  });

  sportsMarqueePriceBoostTile.createField('regionId').name('Region Id').type('Symbol');
  sportsMarqueePriceBoostTile.changeFieldControl('regionId', 'builtin', 'singleLine', {
    helpText: 'The Region Id the fixture belongs to.',
  });

  sportsMarqueePriceBoostTile.createField('competitionId').name('Competition Id').type('Symbol');
  sportsMarqueePriceBoostTile.changeFieldControl('competitionId', 'builtin', 'singleLine', {
    helpText: 'The Competition Id the fixture belongs to.',
  });

  sportsMarqueePriceBoostTile.createField('image').name('Image').type('Text').localized(true);
  sportsMarqueePriceBoostTile.changeFieldControl('image', 'builtin', 'singleLine', {
    helpText:
      'To be used as a fallback image when participants logos are not available. It can be a relative or absolute path to the CDN image.',
  });

  sportsMarqueePriceBoostTile
    .createField('previousDecimalPrice')
    .name('WAS Price (Decimal)')
    .type('Symbol')
    .required(true);
  sportsMarqueePriceBoostTile.changeFieldControl('previousDecimalPrice', 'builtin', 'singleLine', {
    helpText: 'The WAS price for the current selection using the decimal odds format.',
  });

  sportsMarqueePriceBoostTile
    .createField('previousAmericanPrice')
    .name('WAS Price (American)')
    .type('Symbol')
    .required(true);
  sportsMarqueePriceBoostTile.changeFieldControl('previousAmericanPrice', 'builtin', 'singleLine', {
    helpText: 'The WAS price for the current selection using the american odds format.',
  });

  sportsMarqueePriceBoostTile
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
  sportsMarqueePriceBoostTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Marquee Single Selection Tile should be active',
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
          'sportsMarqueePriceBoostTile',
        ],
      },
    ],
  });
}) as MigrationFunction;
