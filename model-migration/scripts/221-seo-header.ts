import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const seoHeader = migration.createContentType('seoHeader').name('SEO Header').description('SEO Header that will be displayed at the top of each page that includes navigation links and CTAs.').displayField('entryTitle');
  seoHeader.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoHeader
    .createField('brandIcon')
    .name('Brand Icon')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxLink'],
      }
    ]);
  seoHeader.changeFieldControl('brandIcon', 'builtin', 'entryLinkEditor', {
    helpText: 'An icon for the Brand that will display in the Header.'
  });

  seoHeader
    .createField('navigationLinks')
    .name('Navigation Links')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxQuickLinks'],
      }
    ]);
  seoHeader.changeFieldControl('navigationLinks', 'builtin', 'entryLinkEditor', {
    helpText: 'A set of links that will be used to Navigate a User to different sections of the site.'
  });

  seoHeader
    .createField('responsibleGamingIcon')
    .name('Responsible Gaming Icon')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxLink'],
      }
    ]);
  seoHeader.changeFieldControl('responsibleGamingIcon', 'builtin', 'entryLinkEditor', {
    helpText: 'The Responsible Gaming icon for the specific Jurisdiction that will display in the Header.'
  });

  seoHeader
    .createField('headerButtons')
    .name('Header Buttons')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxQuickLinks'],
      }
    ]);
  seoHeader.changeFieldControl('headerButtons', 'builtin', 'entryLinkEditor', {
    helpText: 'A set of links that will display as buttons, such as Join Us and Login, in the Header.'
  });

  seoHeader
    .createField('theme')
    .name('Theme')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxTheme']
      }
    ]);
  seoHeader.changeFieldControl('theme', 'builtin', 'entryLinkEditor', {
    helpText: 'The background theme that will be applied to the header, enabling the use of a background colour or image.'
  });

  seoHeader
    .createField('brand')
    .name('Brand')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxBrand'],
      }
    ]);

  seoHeader
    .createField('jurisdiction')
    .name('Jurisdiction')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxJurisdiction'],
      }
    ]);

}) as MigrationFunction;