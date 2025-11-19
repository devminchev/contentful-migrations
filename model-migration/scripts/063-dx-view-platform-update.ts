import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxView = migration.editContentType('dxView');

  dxView
    .createField("platform2")
    .name("Platform2")
    .type("Array")
    .localized(false)
    .required(true)
    .validations([])
    .items({
      type: "Symbol",
      validations: [{
        in: ['WEB', 'ANDROID', 'IOS']
      }]
    });

  dxView.changeFieldControl("platform2", "builtin", "checkbox", {
    helpText: "The platform where the Digital Experience (Dx) View should be active",
  });

  migration.transformEntries({
    contentType: 'dxView',
    from: ['platform'],
    to: ['platform2'],
    transformEntryForLocale: async (from, locale) => {
      if(from.platform[locale] === 'WEB'){
        return {
          platform2: ['WEB']
        }
      } else if(from.platform[locale] === 'ANDROID'){
        return {
          platform2: ['ANDROID']
        }
      } else return {
        platform2: ['IOS']
      }
    }
  });

  dxView.deleteField('platform');

  dxView.editField('platform2').name('Platform');
  dxView.changeFieldId('platform2', 'platform');

}) as MigrationFunction;