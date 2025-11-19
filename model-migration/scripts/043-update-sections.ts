import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const section = migration.editContentType('section');
  section.createField('gamesV2').name('gamesV2')
  .type('Array')
  .items({
    linkType: 'Entry',
    type: 'Link',
    validations: [
      {
        linkContentType: ['siteGameV2'],
      },
    ],
  });
}) as MigrationFunction;