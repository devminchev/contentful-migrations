import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  // Add isNew property onto the sportsLink content model
  const sportsLink = migration.editContentType('sportsLink');

  sportsLink.createField('isNew').name('Is New').type('Boolean').localized(false)
  .defaultValue({
    'en-US': false,
  });

  sportsLink.changeFieldControl('isNew', 'builtin', 'radio', {
    helpText: 'Whether to assign \'Is New\' icon to link',
  });

  sportsLink.moveField('isNew').afterField('image');
  
  // Add isNew property onto the sportsTabItem (Sports Tab Filter) content model
  const sportsTabFilter = migration.editContentType('sportsTabItem');
  sportsTabFilter.createField('isNew').name('Is New').type('Boolean').localized(false)
  .defaultValue({
    'en-US': false,
  });

  sportsTabFilter.changeFieldControl('isNew', 'builtin', 'radio', {
    helpText: 'Whether to assign \'Is New\' icon to sport filter',
  });

  sportsTabFilter.moveField('isNew').afterField('image');

}) as MigrationFunction;
