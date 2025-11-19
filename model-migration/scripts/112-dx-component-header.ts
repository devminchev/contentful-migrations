import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    // Create Dx Component Header

  const dxComponentHeader = migration.createContentType('dxComponentHeader').name('Dx Component Header').description('The Digital Experience Component Header which manages header information including a Title and a link for multiple components').displayField('entryTitle');
  dxComponentHeader.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  dxComponentHeader
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true);

    dxComponentHeader.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'The title of the component header to display to the user',
  });

  dxComponentHeader
  .createField('link')
  .name('Link')
  .type('Link')
  .linkType('Entry')
  .validations([
    {
      linkContentType: ['dxLink']
    }
  ]);

  // Update Dx Banners

  const dxBanners = migration.editContentType('dxBanners');

  dxBanners
    .createField('header')
    .name('Header')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxComponentHeader']
      }
    ])

    // Update Dx Marquee

  const dxMarquee = migration.editContentType('dxMarquee');

  dxMarquee
    .createField('header')
    .name('Header')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxComponentHeader']
      }
    ])

}) as MigrationFunction;
