import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const sportsMarqueeJudoTile = migration
    .createContentType('sportsMarqueeJudoTile')
    .name('Sports Marquee Judo Tile')
    .description('Sports Marquee Judo Tile to be used across SportsBook.')
    .displayField('entryTitle');

  sportsMarqueeJudoTile.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsMarqueeJudoTile
    .createField('url')
    .name('Url')
    .type('Symbol')
    .localized(true)
    .required(true)
    .validations([
      {
        regexp: {
          pattern: '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
          flags: null,
        },
        message: 'Input does not match the expected format. Example: "https://google.com". Please edit and try again.',
      },
    ]);
  sportsMarqueeJudoTile.changeFieldControl('url', 'builtin', 'singleLine', {
    helpText:
      'The entry point that will determine which Judo Experience gets displayed on the front end. This needs to be an absolute URL.',
  });

  sportsMarqueeJudoTile.createField('queries').name('Queries').type('Array').items({
    type: 'Symbol',
    validations: [],
  });
  sportsMarqueeJudoTile.changeFieldControl('queries', 'builtin', 'tagEditor', {
    helpText:
      'This step is optional. Each of the queries will be used as a URL parameter and appended onto the end of the URL. Query String parameter format: {{parameter_name}}={{parameter_value}}. Example: "sort=newest".',
  });

  sportsMarqueeJudoTile
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
  sportsMarqueeJudoTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Link should be active.',
  });

  // Update the existing Sports Marquee Collection to link to the newly created Sports Marquee Judo Tile
  const sportsMarquee = migration.editContentType('sportsMarquee');

  sportsMarquee.editField('sportsMarqueeItems').items({
    type: 'Link',
    linkType: 'Entry',
    validations: [
      {
        linkContentType: ['sportsMarqueeCustomTile', 'sportsMarqueeJudoTile'],
      },
    ],
  });
}) as MigrationFunction;
