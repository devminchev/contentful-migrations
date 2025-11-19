import { MigrationFunction } from "contentful-migration";

export =((migration) => {
  const seoGlobalSettings = migration.editContentType('seoGlobalSettings');

  seoGlobalSettings.createField('socialMediaIcons')
    .name('Social Media Icons')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxQuickLinks']
      }
    ]);

  seoGlobalSettings.changeFieldControl('socialMediaIcons', 'builtin', 'entryLinkEditor', {
    helpText: 'The Social Media links for global settings. The social media icon fields in Blogs etc will be the overrides.',
  });

}) as MigrationFunction;