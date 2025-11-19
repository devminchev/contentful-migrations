import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Dx Controlled Banner
  const dxControlledBanner = migration
    .createContentType('dxControlledBanner')
    .name('Dx Controlled Banner')
    .description("Digital Experience (Dx) Controlled Banner is used to populate banners with managed fields, where the banner isn't just a simple image/link")
    .displayField('entryTitle');

  dxControlledBanner
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol')
    .required(true);

  dxControlledBanner
    .createField('tag')
    .name('Tag')
    .type('Symbol')
    .localized(true)
    .required(false);

  dxControlledBanner.changeFieldControl('tag', 'builtin', 'singleLine', {
    helpText: 'A category by which to group the banner for the user depending on its purpose'
  })

  dxControlledBanner
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(true)
    .required(true);

  dxControlledBanner.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'Provide a title for the banner'
  })

  dxControlledBanner
    .createField('description')
    .name('Description')
    .type('Text')
    .localized(true)
    .required(false);

  dxControlledBanner.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'Provide a description that will be shown to users on the frontend, giving them detailed information about the banner'
  })

  dxControlledBanner
    .createField('url')
    .name('URL')
    .type('Symbol')
    .required(true);

  dxControlledBanner.changeFieldControl('url', 'builtin', 'singleLine', {
    helpText: 'Provide a URL that the banner will redirect users to when selected'
  })

  dxControlledBanner.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .required(true)
    .validations([
      {
        size: {
          min: 1,
          max: 1
        }
      }
    ]);

  dxControlledBanner.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: "The Bynder image used for the banners primary image",
  });

  dxControlledBanner
    .createField('button')
    .name('Button')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['dxLink'],
      }
    ])
    .linkType('Entry');

  dxControlledBanner.changeFieldControl('button', 'builtin', 'entryLinkEditor', {
    helpText: 'Provide a button that will be shown to users on the frontend, allowing them to interact with the banner'
  });

  dxControlledBanner
    .createField('theme')
    .name('Theme')
    .type('Link')
    .localized(false)
    .required(true)

    .validations([
      {
        linkContentType: ['dxTheme']
      }
    ])
    .linkType('Entry');

  dxControlledBanner.changeFieldControl('theme', 'builtin', 'entryLinkEditor', {
    helpText: 'The background theme that will be applied to the banner behind the front facing content'
  });

  // Dx Banners
  const dxBanners = migration.editContentType('dxBanners');

  dxBanners.editField('banners')
    .name('Banners')
    .type('Array')
    .required(true)
    .localized(true)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: [
            'dxBanner',
            'dxControlledBanner'
          ]
        }
      ]
    });

}) as MigrationFunction;