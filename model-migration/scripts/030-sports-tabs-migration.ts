import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  // Sports Tabs
  const sportsTabs = migration
    .createContentType('sportsTabs')
    .name('Sports Tabs')
    .description('A collection of Sports Tabs.')
    .displayField('entryTitle');

  sportsTabs.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsTabs.createField('key').name('Key').type('Symbol').required(true).localized(false);
  sportsTabs.changeFieldControl('key', 'builtin', 'singleLine', {
    helpText: 'Used to identify and retrieve a sports tabs collection. For example "home".',
  });

  sportsTabs
    .createField('tabs')
    .name('Sports Tabs')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsTab'],
        },
      ],
    });

  sportsTabs
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

  sportsTabs
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

  sportsTabs.changeFieldControl('platform', 'builtin', 'radio', {
    helpText: 'The platform where the Sports Tabs should be active.',
  });

  // Sports Tab
  const sportsTab = migration
    .createContentType('sportsTab')
    .name('Sports Tab')
    .description('A Sports Tab to be used as a reference for the Sports Tabs content model.')
    .displayField('entryTitle');

  sportsTab.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsTab.createField('name').name('Name').type('Symbol').required(true).localized(true);
  sportsTab.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'To be used as the display name for the Sports Tab on the frontends.',
  });

  sportsTab
    .createField('tabType')
    .name('Tab Type')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['content', 'placeholder', 'futures'],
      },
    ])
    .defaultValue({
      'en-US': 'content',
    });
  sportsTab.changeFieldControl('tabType', 'builtin', 'dropdown', {
    helpText:
      'Used to determine what layout the Sports Tab should use on the front end, choose from the list of available options.',
  });

  sportsTab
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
  sportsTab.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Link should be active',
  });

  // Sports Tab Filter
  const sportsTabItem = migration
    .createContentType('sportsTabItem')
    .name('Sports Tab Filter')
    .description('A Sports Tab Filter to be used as a reference for the Sports Tab content model.')
    .displayField('entryTitle');

  sportsTabItem.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsTabItem.createField('name').name('Name').type('Symbol').required(true).localized(true);
  sportsTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'To be used as the display name for the Sports Tab Filter on the frontends.',
  });

  sportsTabItem.createField('image').name('Image').type('Text').localized(true);
  sportsTabItem.changeFieldControl('image', 'builtin', 'singleLine', {
    helpText: 'Absolute or relative URL to the image / icon of the filter.',
  });

  sportsTabItem
    .createField('innerGrouping')
    .name('Inner Grouping')
    .type('Text')
    .localized(false)
    .validations([
      {
        in: ['sport', 'region', 'competition'],
      },
    ]);
  sportsTabItem.changeFieldControl('innerGrouping', 'builtin', 'dropdown', {
    helpText:
      'Used to determine what layout the Sports Tab Filter should use on the front end, choose from the list of available options.',
  });

  sportsTabItem
    .createField('outerGrouping')
    .name('Outer Grouping')
    .type('Text')
    .localized(false)
    .validations([
      {
        in: ['live', 'date'],
      },
    ]);
  sportsTabItem.changeFieldControl('outerGrouping', 'builtin', 'dropdown', {
    helpText:
      'Used to determine what layout the Sports Tab Filter should use on the front end, choose from the list of available options.',
  });

  sportsTabItem
    .createField('status')
    .name('Status')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['showPreGame', 'showInGame'],
        },
      ],
    });
  sportsTabItem.changeFieldControl('status', 'builtin', 'checkbox', {
    helpText:
      'This will determine the fixture status as well as market type ids that get attached to the filter on the Config Service layer.',
  });

  // Adding a reference field to the sportsTabItem for the sportsTab
  sportsTab
    .createField('sportsTabItems')
    .name('Sports Tab Filters')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsTabItem'],
        },
      ],
    });

  // Sports Sport
  const sportsSport = migration
    .createContentType('sportsSport')
    .name('Sports Sport')
    .description('A content type used to define a sport.')
    .displayField('entryTitle');
  sportsSport.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsSport.createField('name').name('Name').type('Symbol').required(true).localized(true);
  sportsSport.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The sport display name to be used across SportsBook.',
  });

  sportsSport.createField('id').name('ID').type('Symbol').required(true).localized(false);
  sportsSport.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The ID of the sport or competition.',
  });

  sportsSport.createField('image').name('Image').type('Text').localized(true);
  sportsSport.changeFieldControl('image', 'builtin', 'singleLine', {
    helpText: 'Absolute or relative URL to the image / icon of the sport.',
  });

  sportsSport
    .createField('type')
    .name('Type')
    .type('Text')
    .localized(false)
    .validations([
      {
        in: ['sport', 'competition'],
      },
    ]);
  sportsSport.changeFieldControl('type', 'builtin', 'dropdown', {
    helpText: 'Some of the competitions act as sports across SportsBook and they get coupled together with them.',
  });

  // Adding a reference field to the sportsTab for the sportsTabItem
  sportsTabItem
    .createField('sport')
    .name('Sport')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['sportsSport'],
      },
    ])
    .linkType('Entry');
  sportsTabItem.changeFieldControl('sport', 'builtin', 'entryLinkEditor', {
    helpText:
      'This will be used on the Config Service layer to add additional properties like market type ids required for the filter to correctly display data.',
  });
}) as MigrationFunction;
