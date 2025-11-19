import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const siteGame = migration.editContentType('siteGame');
  siteGame.createField('tags', {
    name: 'tags',
    type: 'Array',
    items: {
      type: 'Symbol',
      validations: [{ in: ['sg-digital'] }],
    },
  });

  siteGame.changeFieldControl('tags', 'builtin', 'tagEditor', {
    helpText: 'Additional info / feature switches for the game',
  });
}) as MigrationFunction;
