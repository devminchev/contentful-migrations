import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const gameInfo = migration.editContentType('gameInfo');
  gameInfo.createField('sash').name('sash').type('Object');
  gameInfo.createField('imgUrlPattern').name('imgUrlPattern').type('Symbol');
  gameInfo.createField('loggedOutImgUrlPattern').name('loggedOutImgUrlPattern').type('Symbol');
  gameInfo.createField('progressiveJackpot').name('progressiveJackpot').type('Boolean');
  gameInfo.createField('progressiveBackgroundColor').name('progressiveBackgroundColor').type('Symbol');
  gameInfo.createField('webComponentData').name('webComponentData').type('Object');
  gameInfo.createField('dfgWeeklyImgUrlPattern').name('dfgWeeklyImgUrlPattern').type('Symbol');
  gameInfo.createField('videoUrlPattern').name('videoUrlPattern').type('Symbol');

  gameInfo.changeFieldControl('sash', 'builtin', 'objectEditor', {
    helpText: 'Configuration for the sash',
  });
  gameInfo.changeFieldControl('imgUrlPattern', 'builtin', 'singleLine', {
    helpText: 'URL pattern for images that represents the game',
  });
  gameInfo.changeFieldControl('loggedOutImgUrlPattern', 'builtin', 'singleLine', {
    helpText: 'URL pattern for images that represents the game for logged out users',
  });
  gameInfo.changeFieldControl('progressiveJackpot', 'builtin', 'boolean', {
    helpText: 'Does the game have a progressive jackpot?',
  });
  gameInfo.changeFieldControl('progressiveBackgroundColor', 'builtin', 'singleLine', {
    helpText: 'Colour associated with the progressive jackpot',
  });
  gameInfo.changeFieldControl('webComponentData', 'builtin', 'objectEditor', {
    helpText: 'Configuration for the web component',
  });
  gameInfo.changeFieldControl('dfgWeeklyImgUrlPattern', 'builtin', 'singleLine', {
    helpText: 'URL pattern for images that will be displayed on the weekly DFG',
  });
  gameInfo.changeFieldControl('videoUrlPattern', 'builtin', 'singleLine', {
    helpText: 'URL for a video that represents the game',
  });

  const recommendedGames = migration
    .createContentType('recommendedGames')
    .name('Recommended Games')
    .description('')
    .displayField('entryTitle');
  recommendedGames.createField('entryTitle').name('entryTitle').type('Symbol');
  recommendedGames
    .createField('venture')
    .name('venture')
    .type('Link')
    .validations([
      {
        linkContentType: ['venture'],
      },
    ])
    .linkType('Entry');
  recommendedGames
    .createField('games')
    .name('games')
    .type('Array')
    .items({
      linkType: 'Entry',
      type: 'Link',
      validations: [
        {
          linkContentType: ['siteGame', 'sectionSiteGame'],
        },
      ],
    });
  recommendedGames
    .createField('environment')
    .name('environment')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['staging', 'production'],
        },
      ],
    });
  recommendedGames.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  recommendedGames.changeFieldControl('venture', 'builtin', 'entryLinkEditor');
  recommendedGames.changeFieldControl('games', 'builtin', 'entryLinksEditor');
  recommendedGames.changeFieldControl('environment', 'builtin', 'checkbox', {
    helpText: 'The environment(s) where the recommended games are active',
  });

  const miniGames = migration
    .createContentType('miniGames')
    .name('Mini Games')
    .description('')
    .displayField('entryTitle');
  miniGames.createField('entryTitle').name('entryTitle').type('Symbol');
  miniGames
    .createField('venture')
    .name('venture')
    .type('Link')
    .validations([
      {
        linkContentType: ['venture'],
      },
    ])
    .linkType('Entry');
  miniGames
    .createField('sections')
    .name('sections')
    .type('Array')
    .items({
      linkType: 'Entry',
      type: 'Link',
      validations: [
        {
          linkContentType: ['section'],
        },
      ],
    });
  miniGames
    .createField('environment')
    .name('environment')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['staging', 'production'],
        },
      ],
    });
  miniGames.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  miniGames.changeFieldControl('venture', 'builtin', 'entryLinkEditor');
  miniGames.changeFieldControl('sections', 'builtin', 'entryLinksEditor');
  miniGames.changeFieldControl('environment', 'builtin', 'checkbox', {
    helpText: 'The environment(s) where the mini games are active',
  });

  const sectionSiteGame = migration
    .createContentType('sectionSiteGame')
    .name('Section Site Game')
    .description('')
    .displayField('entryTitle');
  sectionSiteGame.createField('entryTitle').name('entryTitle').type('Symbol');
  sectionSiteGame
    .createField('siteGame')
    .name('siteGame')
    .type('Link')
    .validations([
      {
        linkContentType: ['siteGame'],
      },
    ])
    .linkType('Entry');
  sectionSiteGame
    .createField('gameInfoOverride')
    .name('gameInfoOverride')
    .type('Link')
    .validations([
      {
        linkContentType: ['gameInfo'],
      },
    ])
    .linkType('Entry');
  sectionSiteGame.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  sectionSiteGame.changeFieldControl('siteGame', 'builtin', 'entryLinkEditor');

  const section = migration.createContentType('section').name('Section').description('').displayField('entryTitle');
  section.createField('entryTitle').name('entryTitle').type('Symbol');
  section
    .createField('games')
    .name('games')
    .type('Array')
    .items({
      linkType: 'Entry',
      type: 'Link',
      validations: [
        {
          linkContentType: ['siteGame', 'sectionSiteGame'],
        },
      ],
    });
  section.createField('name').name('name').type('Symbol');
  section.createField('type').name('type').type('Symbol');
  section
    .createField('show')
    .name('show')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['loggedIn', 'loggedOut'],
        },
      ],
    });
  section.createField('className').name('className').type('Symbol');
  section.createField('carousel').name('carousel').type('Object');
  section.createField('header').name('header').type('Boolean');
  section.createField('title').name('title').type('Symbol');
  section.createField('jackpots').name('jackpots').type('Array').items({
    type: 'Symbol',
    validations: [],
  });
  section.createField('href').name('href').type('Symbol');
  section.createField('videoUrl').name('videoUrl').type('Symbol');
  section.createField('image').name('image').type('Symbol');
  section.createField('highlightColor').name('highlightColor').type('Symbol');
  section.createField('sizes').name('sizes').type('Object');
  section.createField('slides').name('slides').type('Object');
  section.createField('style').name('style').type('Object');
  section.createField('priorityOverride').name('priorityOverride').type('Number');
  section.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  section.changeFieldControl('games', 'builtin', 'entryLinksEditor');
  section.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'Unique section name (per layout)',
  });
  section.changeFieldControl('type', 'builtin', 'singleLine', {
    helpText: 'Type of section to display',
  });
  section.changeFieldControl('show', 'builtin', 'checkbox', {
    helpText: 'In which context should the section appear?',
  });
  section.changeFieldControl('className', 'builtin', 'singleLine', {
    helpText: 'Class name to use for the section',
  });
  section.changeFieldControl('carousel', 'builtin', 'objectEditor', {
    helpText: 'Configuration for the carousel',
  });
  section.changeFieldControl('header', 'builtin', 'boolean', {
    helpText: 'Should the header be displayed?',
  });
  section.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'Title of the section',
  });
  section.changeFieldControl('jackpots', 'builtin', 'tagEditor', {
    helpText: 'List of jackpot identifiers',
  });
  section.changeFieldControl('href', 'builtin', 'singleLine', {
    helpText: 'Destination URL (only required for banners)',
  });
  section.changeFieldControl('videoUrl', 'builtin', 'singleLine', {
    helpText: 'URL for a video to be used as a banner',
  });
  section.changeFieldControl('image', 'builtin', 'singleLine', {
    helpText: 'URL pattern for an image to be used as a banner',
  });
  section.changeFieldControl('highlightColor', 'builtin', 'singleLine', {
    helpText: 'Background colour',
  });
  section.changeFieldControl('sizes', 'builtin', 'objectEditor', {
    helpText: 'Configuration of game sizes (e.g. { "1": "tall wide", "7": "wide" })',
  });
  section.changeFieldControl('slides', 'builtin', 'objectEditor', {
    helpText: 'Configuration for slides',
  });
  section.changeFieldControl('style', 'builtin', 'objectEditor', {
    helpText: 'Configuration for style',
  });
  section.changeFieldControl('priorityOverride', 'builtin', 'numberEditor', {
    helpText: 'Priority value to override ML decisions (do not use, unless advised)',
  });

  const layout = migration.createContentType('layout').name('Layout').description('').displayField('entryTitle');
  layout.createField('entryTitle').name('entryTitle').type('Symbol');
  layout
    .createField('sections')
    .name('sections')
    .type('Array')
    .items({
      linkType: 'Entry',
      type: 'Link',
      validations: [
        {
          linkContentType: ['section'],
        },
      ],
    })
    .validations([
      {
        size: { max: 18 },
        message: 'A maximum of 18 sections is currently supported',
      },
    ]);
  layout
    .createField('venture')
    .name('venture')
    .type('Link')
    .validations([
      {
        linkContentType: ['venture'],
      },
    ])
    .linkType('Entry');
  layout.createField('partner').name('partner').type('Boolean');
  layout
    .createField('environment')
    .name('environment')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['staging', 'production'],
        },
      ],
    });
  layout
    .createField('platform')
    .name('platform')
    .type('Symbol')
    .validations([
      {
        in: ['phone', 'tablet', 'desktop'],
      },
    ]);
  layout.createField('name').name('name').type('Symbol');

  layout.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  layout.changeFieldControl('sections', 'builtin', 'entryLinksEditor');
  layout.changeFieldControl('venture', 'builtin', 'entryLinkEditor');
  layout.changeFieldControl('partner', 'builtin', 'boolean', {
    helpText: 'Is this layout for partner site(s)?',
  });
  layout.changeFieldControl('environment', 'builtin', 'checkbox', {
    helpText: 'The environment(s) where the layout is active',
  });
  layout.changeFieldControl('platform', 'builtin', 'radio', {
    helpText: 'The platform where the layout is active',
  });
  layout.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'Unique name of the layout (must match the name of its category)',
  });

  const category = migration.createContentType('category').name('Category').description('').displayField('entryTitle');
  category.createField('entryTitle').name('entryTitle').type('Symbol');
  category.createField('title').name('title').type('Symbol');
  category.createField('name').name('name').type('Symbol');
  category.createField('slug').name('slug').type('Symbol');
  category.createField('id').name('id').type('Symbol');
  category.createField('url').name('url').type('Symbol');
  category.createField('backgroundColor').name('backgroundColor').type('Symbol');
  category.createField('backgroundImgUrl').name('backgroundImgUrl').type('Symbol');
  category.createField('icons').name('icons').type('Object');
  category.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  category.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'Title of the category',
  });
  category.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'Part of the URL that appears first (i.e. /name, e.g. /category)',
  });
  category.changeFieldControl('slug', 'builtin', 'singleLine', {
    helpText:
      'Part of the URL that appears after the name (i.e. /name/slug, e.g. /category/slots) (must match the name of its layout)',
  });
  category.changeFieldControl('id', 'builtin', 'singleLine', {
    helpText: 'Unique identifier of the category (used for the native apps)',
  });
  category.changeFieldControl('url', 'builtin', 'singleLine', {
    helpText: 'Destination URL (only required for external links)',
  });
  category.changeFieldControl('backgroundColor', 'builtin', 'singleLine', {
    helpText: 'Background colour of the category page',
  });
  category.changeFieldControl('backgroundImgUrl', 'builtin', 'singleLine', {
    helpText: 'Background image URL pattern of the category page',
  });
  category.changeFieldControl('icons', 'builtin', 'objectEditor', {
    helpText: 'Configuration of icons (used for the native apps)',
  });

  const categories = migration
    .createContentType('categories')
    .name('Categories')
    .description('')
    .displayField('entryTitle');
  categories.createField('entryTitle').name('entryTitle').type('Symbol');
  categories
    .createField('categories')
    .name('categories')
    .type('Array')
    .items({
      linkType: 'Entry',
      type: 'Link',
      validations: [
        {
          linkContentType: ['category'],
        },
      ],
    });
  categories
    .createField('venture')
    .name('venture')
    .type('Link')
    .validations([
      {
        linkContentType: ['venture'],
      },
    ])
    .linkType('Entry');
  categories.createField('partner').name('partner').type('Boolean');
  categories
    .createField('environment')
    .name('environment')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['staging', 'production'],
        },
      ],
    });
  categories.createField('native').name('native').type('Boolean');

  categories.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  categories.changeFieldControl('categories', 'builtin', 'entryLinksEditor');
  categories.changeFieldControl('venture', 'builtin', 'entryLinkEditor');
  categories.changeFieldControl('partner', 'builtin', 'boolean', {
    helpText: 'Are these categories for partner site(s)?',
  });
  categories.changeFieldControl('environment', 'builtin', 'checkbox', {
    helpText: 'The environment(s) where the categories are active',
  });
  categories.changeFieldControl('native', 'builtin', 'boolean', {
    helpText: 'Are these categories for the native apps?',
  });
}) as MigrationFunction;
