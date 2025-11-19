import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const seoGlobalSettings = migration.editContentType('seoGlobalSettings')

  seoGlobalSettings
    .createField('gamingCommissionText')
    .name('Gaming Commission Text')
    .type('Object')
    .localized(true)
    .required(false);
  seoGlobalSettings.changeFieldControl("gamingCommissionText", "app", "z2LsIOTTtkiEsfv1iiqtr", {
    helpText: "An overview of rules and any Gaming Commission information.",
  });

  seoGlobalSettings.moveField('gamingCommissionText').afterField('showBreadcrumbs');

  seoGlobalSettings
    .createField('googleSiteVerification')
    .name('Google Site Verification')
    .type('Symbol')
    .localized(false)
    .required(false);
  seoGlobalSettings.changeFieldControl("googleSiteVerification", "builtin", "singleLine", {
    helpText: "A meta tag to verify website ownership with Google Search Console",
  });

  seoGlobalSettings
    .createField('msvalidate01')
    .name('MS Validate 01')
    .type('Symbol')
    .localized(false)
    .required(false);
  seoGlobalSettings.changeFieldControl("msvalidate01", "builtin", "singleLine", {
    helpText: "A meta tag to verify website ownership with Bing Webmaster Tools",
  });

  seoGlobalSettings.moveField('googleSiteVerification').beforeField('brand');
  seoGlobalSettings.moveField('msvalidate01').beforeField('brand');

}) as MigrationFunction;
