import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

  const LOCALE = space?.spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

  // Sports Marquee Specials PrePack Tile
  const sportsMarqueeSpecialsPrepackTile = migration
    .createContentType('sportsMarqueeSpecialsPrePackTile')
    .name('Sports Marquee Specials PrePack Tile')
    .description('A sports marquee pre-pack tile used to display SPS (boost) prepacks.')
    .displayField('entryTitle');

  sportsMarqueeSpecialsPrepackTile
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  sportsMarqueeSpecialsPrepackTile
    .createField('prePackId')
    .name('Pre Pack Id')
    .type('Symbol')
    .required(true)

  sportsMarqueeSpecialsPrepackTile
    .createField('segmentation')
    .name('Segmentation')
    .type('Array')
    .localized(false)
    .required(true)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['showWhenLoggedIn', 'showWhenLoggedOut'],
        },
      ],
    })
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });

  sportsMarqueeSpecialsPrepackTile.createField('backgroundImage')
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

  sportsMarqueeSpecialsPrepackTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Marquee Specials tile should be active',
  });

  sportsMarqueeSpecialsPrepackTile.changeFieldControl('prePackId', 'builtin', 'singleLine', {
    helpText: 'Specific PrePack ID to be used within the tile.',
  });

  sportsMarqueeSpecialsPrepackTile.changeFieldControl('backgroundImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: "Provides a background image for the prepack tile.",
  });

  // Sports Marquee Specials Boosts Tile

  const sportsMarqueeSpecialsBoostsTile = migration.editContentType('sportsMarqueeSpecialsBoostsTile');

  sportsMarqueeSpecialsBoostsTile
    .createField('segmentation')
    .name('Segmentation')
    .type('Array')
    .localized(false)
    .required(true)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['showWhenLoggedIn', 'showWhenLoggedOut'],
        },
      ],
    })
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });

  sportsMarqueeSpecialsBoostsTile.createField('backgroundImage')
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

  // update help texts

  sportsMarqueeSpecialsBoostsTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Marquee Specials Boosts tile should be active',
  });

  sportsMarqueeSpecialsBoostsTile.changeFieldControl('backgroundImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: "Provides a background image for Sports Marquee Specials Boosts tile.",
  });

  // Update the Marquee Items to include the Sports Specials PrePack Tile

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
          'sportsMarqueeScoreboardTile',
          'sportsMarqueeSingleSelectionTile',
          'sportsMarqueeSixPackTile',
          'dxPlayerRewardsTile',
          'sportsMarqueeSpecialsBoostsTile',
          'sportsMarqueeSpecialsPrePackTile'
        ],
      },
    ],
  });

}) as MigrationFunction;
