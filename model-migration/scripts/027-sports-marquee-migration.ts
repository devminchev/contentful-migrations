import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const sportsMarquee = migration
    .createContentType('sportsMarquee')
    .name('Sports Marquee')
    .description('A collection of Sports Marquee Items.')
    .displayField('entryTitle');

  sportsMarquee.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsMarquee.createField('key').name('Key').type('Symbol').required(true).localized(false);

  sportsMarquee
    .createField('sportsMarqueeItems')
    .name('Sports Marquee Items')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsMarqueeCustomTile'],
        },
      ],
    });

  sportsMarquee
    .createField('venture')
    .name('Venture')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['venture'],
      },
    ])
    .linkType('Entry');

  sportsMarquee
    .createField('platform')
    .name('Platform')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['WEB', 'NATIVE', 'ANDROID', 'IOS', 'RETAIL'],
      },
    ]);

  sportsMarquee.changeFieldControl('platform', 'builtin', 'radio', {
    helpText: 'The platform where the Sports Marquee should be active',
  });

  const sportsMarqueeCustomTile = migration
    .createContentType('sportsMarqueeCustomTile')
    .name('Sports Marquee Custom Tile')
    .description('Marquee Custom Tile used across SportsBook')
    .displayField('entryTitle');

  sportsMarqueeCustomTile.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsMarqueeCustomTile.createField('title').name('Title').type('Symbol').localized(true);
  sportsMarqueeCustomTile.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'Sports Marquee Custom Tile Title',
  });

  sportsMarqueeCustomTile.createField('body').name('Body').type('Text').localized(true);
  sportsMarqueeCustomTile.changeFieldControl('body', 'builtin', 'multipleLine', {
    helpText: 'Sports Marquee Custom Tile tag line',
  });

  sportsMarqueeCustomTile
    .createField('type')
    .name('Type')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['customTile'],
      },
    ])
    .defaultValue({
      'en-US': 'customTile',
    });
  sportsMarqueeCustomTile.changeFieldControl('type', 'builtin', 'dropdown', {
    helpText:
      'Used to determine what layout the Sports Marquee Custom Tile should use on the front end, choose from the list of available options',
  });

  sportsMarqueeCustomTile.createField('url').name('Url').type('Symbol').localized(true);
  sportsMarqueeCustomTile.changeFieldControl('url', 'builtin', 'singleLine', {
    helpText:
      "Full url to the destination, only to be used if buttons aren't desired, and want to treat the whole sports marquee custom tile as a clickable area",
  });

  sportsMarqueeCustomTile.createField('image').name('Image').type('Text').localized(true);
  sportsMarqueeCustomTile.changeFieldControl('image', 'builtin', 'singleLine', {
    helpText: 'Relative or Absolute path to image in CDN (later to be replaced with DAM)',
  });

  sportsMarqueeCustomTile
    .createField('buttons')
    .name('Buttons')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsLink'],
        },
      ],
    });

  sportsMarqueeCustomTile
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
  sportsMarqueeCustomTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Link should be active',
  });
}) as MigrationFunction;
