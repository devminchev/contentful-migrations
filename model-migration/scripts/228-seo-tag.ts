import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const validation = {
    regexp: {
      pattern: `^(http:\\/\\/|https:\\/\\/|\\/)(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\\-\\/]))?$`
    },
    message: 'Input does not match the expected format. Example: url "https://play.ballybet.com/sports" or a relative path starting with "/". Please edit and try again.'
  }

  // Create SEO Tag
  const seoTag = migration
    .createContentType('seoTag')
    .name('SEO Tag')
    .description('SEO Tag will help the Front End teams filter out Games and Blogs etc based on the Tags provided.')
    .displayField('entryTitle');
  seoTag.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoTag
    .createField('tag')
    .name('Tag')
    .type('Symbol')
    .required(true)
    .localized(false)
    .validations([
      {
        unique: true,
      },
      {
        regexp: {
          pattern: "^[a-z0-9-]*$"
        }
      }
    ]);
  seoTag.changeFieldControl("tag", "builtin", "singleLine", {
    helpText: "The Tag to be used in fetch requests for Games and Blogs. Must be all lowercase and with dashes instead of spaces e.g online-slots",
  });

  seoTag
    .createField('link')
    .name('Link')
    .type('Symbol')
    .required(false)
    .localized(false)
    .validations([validation]);
  seoTag.changeFieldControl("link", "builtin", "singleLine", {
    helpText: "A URL used to direct a user to a page.",
  });

}) as MigrationFunction;
