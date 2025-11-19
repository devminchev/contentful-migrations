import { MigrationFunction } from "contentful-migration";

export = ((migration) => {

  // Seo Game - Brand & Jurisdiction
  const seoGame = migration.editContentType('seoGame');
  
  // Create Brand field
  seoGame
    .createField('singularBrand')
    .name('Brand')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxBrand'],
      }
    ]);
  seoGame.moveField('singularBrand').afterField('brand');

  // Create Jurisdiction field
  seoGame
    .createField('singularJurisdiction')
    .name('Jurisdiction')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxJurisdiction'],
      }
    ]);
  seoGame.moveField('singularJurisdiction').afterField('jurisdiction');

  // Transform Brand data
  migration.transformEntries({
    contentType: 'seoGame',
    from: ['brand'],
    to: ['singularBrand'],
    transformEntryForLocale: async (from, locale) => {
      if (from?.brand?.[locale]) {
        return { singularBrand: from.brand?.[locale]?.[0] }
      }
    }
  });

  // Transform Jurisdiction data
  migration.transformEntries({
    contentType: 'seoGame',
    from: ['jurisdiction'],
    to: ['singularJurisdiction'],
    transformEntryForLocale: async (from, locale) => {
      if (from?.jurisdiction?.[locale]) {
        return { singularJurisdiction: from.jurisdiction?.[locale]?.[0] }
      }
    }
  });

  seoGame.changeFieldControl('singularBrand', 'builtin', 'entryLinkEditor', {
    helpText: 'Select a single brand for this SEO Game entry.'
  });
  seoGame.editField('singularBrand').required(true);

  seoGame.changeFieldControl('singularJurisdiction', 'builtin', 'entryLinkEditor', {
    helpText: 'Select a single jurisdiction for this SEO Game entry.'
  });

  seoGame.editField('brand').required(false);
  seoGame.changeFieldControl('brand', 'builtin', 'entryLinksEditor', {
    helpText: 'To be DEPRECATED - use other Brand field instead.'
  });

  seoGame.editField('jurisdiction').required(false);
  seoGame.changeFieldControl('jurisdiction', 'builtin', 'entryLinksEditor', {
    helpText: 'To be DEPRECATED - use other Jurisdiction field instead.'
  });

}) as MigrationFunction;
