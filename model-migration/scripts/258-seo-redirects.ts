import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const validation = {
    regexp: {
      pattern: `^(http:\\/\\/|https:\\/\\/|\\/)(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\\-\\/]))?|\/$`
    },
    message: 'Input does not match the expected format. Example: url "https://play.ballybet.com/sports" or a relative path starting with "/". Please edit and try again.'
  }

  // Create SEO Tag
  const seoRedirect = migration
    .createContentType('seoRedirect')
    .name('SEO Redirect')
    .description('SEO Redirects will help the Front End teams redirect users to the correct page.')
    .displayField('entryTitle');
  seoRedirect.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoRedirect
    .createField('fromPath')
    .name('From Path')
    .type('Symbol')
    .required(true)
    .validations([validation]);
  seoRedirect.changeFieldControl("fromPath", "builtin", "singleLine", {
    helpText: "A URL that will be redirected to the toPath.",
  });

  seoRedirect
    .createField('toPath')
    .name('To Path')
    .type('Symbol')
    .required(true)
    .validations([validation]);
  seoRedirect.changeFieldControl("toPath", "builtin", "singleLine", {
    helpText: "A URL that a user will be redirected to.",
  });

  seoRedirect
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

  seoRedirect
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
