import { MigrationFunction } from "contentful-migration";

export = ((migration) => {

  // Seo Blog - Brand only
  const seoBlog = migration.editContentType('seoBlog');
  seoBlog
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
  seoBlog.moveField('singularBrand').afterField('brand');

  migration.transformEntries({
    contentType: 'seoBlog',
    from: ['brand'],
    to: ['singularBrand'],
    transformEntryForLocale: async (from, locale) => {
      if (from.brand?.[locale]) {
        return { singularBrand: from.brand?.[locale]?.[0] }
      }
    }
  });

  seoBlog.changeFieldControl('singularBrand', 'builtin', 'entryLinkEditor', {
    helpText: 'Select a single brand for this SEO Blog entry.'
  });

  seoBlog.editField('singularBrand').required(true);

  // Create Jurisdiction field
  seoBlog
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
  seoBlog.moveField('jurisdiction').afterField('singularBrand');

  seoBlog.changeFieldControl('jurisdiction', 'builtin', 'entryLinkEditor', {
    helpText: 'Select a jurisdiction for this SEO Blog entry.'
  });

  seoBlog.editField('brand').required(false);
  seoBlog.changeFieldControl('brand', 'builtin', 'entryLinksEditor', {
    helpText: 'To be DEPRECATED - use other Brand field instead.'
  });

}) as MigrationFunction;
