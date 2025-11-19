import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {
  const LOCALE = space?.spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

  const seoRedirect = migration.editContentType('seoRedirect');

  seoRedirect.createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['301', '302', '307', '308']
      }
    ])
    .defaultValue({
      [LOCALE]: '301'
    });
  seoRedirect.changeFieldControl('type', 'builtin', 'radio', {
    helpText: 'The type of redirect. 301 is a permanent redirect, 302 is a temporary redirect, 307 is a temporary redirect but keeps original HTTP request method, and 308 is a permanent redirect but keeps original HTTP request method.',
  });

  seoRedirect.moveField('type').afterField('toPath');

  migration.transformEntries({
    contentType: 'seoRedirect',
    from: ['type'],
    to: ['type'],
    transformEntryForLocale: function (fromFields, currentLocale) {
      return {
        type: '301'
      };
    }
  });

}) as MigrationFunction;
