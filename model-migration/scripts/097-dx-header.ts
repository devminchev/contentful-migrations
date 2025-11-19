import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxHeader = migration.createContentType('dxHeader').name('Dx Header').description('The Digital Experience Header component that will appear at the top of the page in Dx View.').displayField('entryTitle');
  dxHeader.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  dxHeader
    .createField('title')
    .name('Title')
    .type('Symbol');

    dxHeader
    .createField('icon')
    .name('Icon')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
  dxHeader.changeFieldControl('icon', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used as the Icon in Dx Header',
  });

  dxHeader
    .createField('theme')
    .name('Theme')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxTheme']
      }
    ]);

  dxHeader
    .createField('showBackButton')
    .name('Show Back Button')
    .type('Boolean')
    .defaultValue({
      'en-US': false
    });

  dxHeader
    .createField('showSwitcher')
    .name('Show Switcher')
    .type('Boolean')
    .defaultValue({
      'en-US': false
    });

  // View updates
  const dxView = migration.editContentType('dxView');

  // Top Content
  dxView.editField('topContent').items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: [
          "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxContent", "dxHeader"
        ],
      },
    ],
  });

}) as MigrationFunction;
