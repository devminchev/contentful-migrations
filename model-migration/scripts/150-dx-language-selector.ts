import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Dx Language Selector
  const dxLanguage = migration.createContentType('dxLanguage').name('Dx Language').description('Digital Experience (Dx) Language will contain information relating to a language a user can select.').displayField('entryTitle');
  dxLanguage
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol')
    .required(true);
  dxLanguage.changeFieldControl('entryTitle', 'builtin', 'singleLine', {
    helpText: 'The entryTitle must display the Language and the Language/Country Abbreviation it relates to. i.e english [en-US] or spanish [es-US]'
  });

  dxLanguage
    .createField('language')
    .name('Language')
    .type('Symbol')
    .required(true)
    .localized(true);
  dxLanguage.changeFieldControl('language', 'builtin', 'singleLine', {
    helpText: 'The name of the language. For example: English, Spanish, French.'
  });

  dxLanguage
    .createField('languageCode')
    .name('Language Code')
    .type('Symbol')
    .required(true)
    .validations([
      {
        regexp: {
          pattern: "^(\\w{2,3}-\\w{2,3})$"
        }
      }
    ]);
  dxLanguage.changeFieldControl('languageCode', 'builtin', 'singleLine', {
    helpText: 'The language code, which contains an abbreviated language and country. For example: en-US, en-GB, es-US, fr-CA'
  });

  dxLanguage
    .createField('flag')
    .name('Flag')
    .type('Object')
    .required(true)
    .validations([
      {
        size: { max: 1 }
      }
    ]);
  dxLanguage.changeFieldControl('flag', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image to be displayed as a flag that relates to the Language.',
  });


  // Add Language Selector to Dx Footer
  const dxFooter = migration.editContentType('dxFooter');

  dxFooter
    .createField('languageSelector')
    .name('Language Selector')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: [
            'dxLanguage'
          ]
        },
      ],
    })
    .validations([
      {
        size: {
          min: 2,
          max: 5
        }
      }
    ]);
  dxFooter.changeFieldControl('languageSelector', 'builtin', 'entryLinksEditor', {
    helpText: 'Select the languages to show in the Footer Language Selector. A minimum of 2 languages need to be selected for this feature.'
  });

  dxFooter.moveField('languageSelector').beforeField('navigationLinks');

}) as MigrationFunction;
