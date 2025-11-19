import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxComponentHeader = migration.editContentType('dxComponentHeader');
  dxComponentHeader.createField('icon')
    .name('Icon')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
  dxComponentHeader.changeFieldControl('icon', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image to be used as an icon within Dx Component Header.',
  });
  dxComponentHeader.moveField('icon').afterField('title');

}) as MigrationFunction;