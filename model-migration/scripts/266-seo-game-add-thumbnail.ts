import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const seoGame = migration.editContentType('seoGame');

  seoGame.createField('thumbnail')
    .name('Thumbnail')
    .type('Object')
    .required(false)
    .localized(true)
    .validations([
      {
        size: {
          min: 1,
          max: 1
        }
      }
    ]);
  seoGame.changeFieldControl('thumbnail', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: "A Thumbnail image for the Game. This is used to display the Game in multi-tile locations.",
  });

  seoGame.moveField('thumbnail').afterField('overlay');
}) as MigrationFunction;
