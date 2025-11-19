import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const validation = {
    regexp: {
      pattern: `^(http:\\/\\/|https:\\/\\/|\\/)(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\\-\\/]))?$`
    },
    message: 'Input does not match the expected format. Example: url "https://play.ballybet.com/sports" or a relative path starting with "/". Please edit and try again.'
  }

  // Create SEO Category
  const seoCategory = migration
    .createContentType('seoCategory')
    .name('SEO Category')
    .description('SEO Category will contain a title, which will be used in fetch calls, and also optional legal text and links that can be used in other SEO models, such as Game and Blog.')
    .displayField('entryTitle');
  seoCategory.createField('entryTitle').name('entryTitle').type('Symbol').required(true);


  seoCategory
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true)
    .localized(true);
  seoCategory.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "The Title of the category to be displayed by the Front End e.g Online Slots",
  });

  seoCategory
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
  seoCategory.changeFieldControl("tag", "builtin", "singleLine", {
    helpText: "The Tag to be used in fetch requests for Games and Blogs. Must be all lowercase and with dashes instead of spaces e.g online-slots",
  });

  seoCategory
    .createField('gamingCommissionText')
    .name('Gaming Commission Text')
		.type('Object')
		.localized(true)
		.required(false);
  seoCategory.changeFieldControl("gamingCommissionText", "app", "z2LsIOTTtkiEsfv1iiqtr", {
    helpText: "An overview of rules and any Gaming Commission information.",
  });

  seoCategory
    .createField('gamingCommissionLink')
    .name('Gaming Commission Link')
    .type('Symbol')
    .required(false)
    .localized(false)
    .validations([validation]);
  seoCategory.changeFieldControl("gamingCommissionLink", "builtin", "singleLine", {
    helpText: "A URL used to direct a user to the Gaming Commission's site.",
  });

  seoCategory
    .createField('registrationLink')
    .name('Registration Link')
    .type('Symbol')
    .required(false)
    .localized(false)
    .validations([validation]);
  seoCategory.changeFieldControl("registrationLink", "builtin", "singleLine", {
    helpText: "A URL used to direct a user to a registration page.",
  });

}) as MigrationFunction;
