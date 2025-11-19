import { MigrationFunction } from 'contentful-migration';
import { RICH_CONTENT_EDITOR } from './constants';

export = ((migration) => {
  const footerIcon = migration
    .createContentType('footerIcon')
    .name('Footer Icon')
    .description('')
    .displayField('entryTitle');
  footerIcon.createField('entryTitle').name('entryTitle').type('Symbol');
  footerIcon.createField('imagePath').name('imagePath').type('Symbol');
  footerIcon.createField('link').name('link').type('Symbol');
  footerIcon.createField('title').name('title').type('Symbol').localized(true);

  footerIcon.changeFieldControl('imagePath', 'builtin', 'singleLine', {
    helpText: 'Path route to the image',
  });
  footerIcon.changeFieldControl('link', 'builtin', 'singleLine', {
    helpText: 'External URL to the site',
  });
  footerIcon.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'Title of the footer icon',
  });

  const footerLink = migration
    .createContentType('footerLink')
    .name('Footer Link')
    .description('')
    .displayField('entryTitle');
  footerLink.createField('entryTitle').name('entryTitle').type('Symbol');
  footerLink.createField('link').name('link').type('Symbol');
  footerLink.createField('title').name('title').type('Symbol').localized(true);

  footerLink.changeFieldControl('link', 'builtin', 'singleLine', {
    helpText: 'External URL to the site',
  });
  footerLink.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'Title of the footer Link',
  });

  const footer = migration.createContentType('footer').name('Footer').description('').displayField('entryTitle');
  footer.createField('entryTitle').name('entryTitle').type('Symbol');
  footer
    .createField('venture')
    .name('venture')
    .type('Link')
    .validations([{ linkContentType: ['venture'] }])
    .linkType('Entry');

  footer
    .createField('footerIcons')
    .name('footerIcons')
    .type('Array')
    .items({
      linkType: 'Entry',
      type: 'Link',
      validations: [
        {
          linkContentType: ['footerIcon'],
        },
      ],
    })
    .validations([
      {
        size: { max: 25 },
        message: 'A maximum of 25 footer icons are currently supported',
      },
    ]);

  footer
    .createField('footerLinks')
    .name('footerLinks')
    .type('Array')
    .items({
      linkType: 'Entry',
      type: 'Link',
      validations: [
        {
          linkContentType: ['footerLink'],
        },
      ],
    })
    .validations([
      {
        size: { max: 10 },
        message: 'A maximum of 10 footer links are currently supported',
      },
    ]);

  footer.createField('legalInfo').name('legalInfo').type('Text').localized(true);
  footer.createField('welcomeOffer').name('welcomeOffer').type('Text').localized(true);
  footer.createField('welcomeOfferTitle').name('welcomeOfferTitle').type('Symbol').localized(true);
  footer.createField('partner').name('partner').type('Boolean');

  footer.changeFieldControl('legalInfo', 'app', RICH_CONTENT_EDITOR, {
    helpText: 'Venture Legal Information',
  });

  footer.changeFieldControl('welcomeOffer', 'app', RICH_CONTENT_EDITOR, {
    helpText: 'Offers new members rewards under qualifying requirements',
  });
  footer.changeFieldControl('welcomeOfferTitle', 'builtin', 'singleLine', {
    helpText: 'Title of the welcome offer section',
  });
  footer.changeFieldControl('partner', 'builtin', 'boolean', {
    helpText: 'Is this footer for partner site(s)?', 
  });
}) as MigrationFunction;
