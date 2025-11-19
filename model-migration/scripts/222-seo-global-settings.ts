import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {
  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  // Create SEO Global Settings
  const seoGlobalSettings = migration.createContentType('seoGlobalSettings').name('SEO Global Settings').description('SEO Global Settings that will hold components that will apply to an entire site that matches the Brand and Jurisdiction set.').displayField('entryTitle');
  seoGlobalSettings.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoGlobalSettings
    .createField("showBreadcrumbs")
    .name("Show Breadcrumbs")
    .type("Boolean")
    .localized(false)
    .required(false)
    .defaultValue({
      [LOCALE]: false
    });
  seoGlobalSettings.changeFieldControl("showBreadcrumbs", "builtin", "radio", {
    helpText: "Used to determine if the whole site should display breadcrumbs on it's pages or not."
  });

  seoGlobalSettings
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

  seoGlobalSettings
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