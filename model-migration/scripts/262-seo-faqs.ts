import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Create SEO FAQs
  const seoFAQs = migration
    .createContentType('seoFAQs')
    .name('SEO FAQs')
    .description('SEO FAQs will contain a question and answer, as well as JSON LD data for SEO, to help a User by displaying Frequently Asked Questions.')
    .displayField('entryTitle');
  seoFAQs.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoFAQs
    .createField('question')
    .name('Question')
    .type('Symbol')
    .required(true)
    .localized(true);
  seoFAQs.changeFieldControl("question", "builtin", "singleLine", {
    helpText: "The Question to be displayed by the Front End e.g What is the minimum deposit?",
  });

  seoFAQs
    .createField('jsonLdQuestion')
    .name('JSON LD Question')
    .type('Symbol')
    .required(false)
    .localized(true);
  seoFAQs.changeFieldControl("jsonLdQuestion", "builtin", "singleLine", {
    helpText: "The Question to be displayed by the Front End e.g What is the minimum deposit? This is used for JSON LD data for SEO.",
  });

  seoFAQs
    .createField('answer')
    .name('Answer')
    .type('Symbol')
    .required(true)
    .localized(true);
  seoFAQs.changeFieldControl("answer", "builtin", "singleLine", {
    helpText: "The Answer to be displayed by the Front End e.g The minimum deposit is £10.",
  });

  seoFAQs
    .createField('jsonLdAnswer')
    .name('JSON LD Answer')
    .type('Symbol')
    .required(false)
    .localized(true);
  seoFAQs.changeFieldControl("jsonLdAnswer", "builtin", "singleLine", {
    helpText: "The Answer to be displayed by the Front End e.g The minimum deposit is £10. This is used for JSON LD data for SEO.",
  });

}) as MigrationFunction;