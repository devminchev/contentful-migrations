import { ContentFields, MigrationFunction } from 'contentful-migration';

export = ((migration) => {
const section = migration.editContentType('section');
section.deleteField('games') //delete old games in production
section.changeFieldId('gamesV2','games')//change test12345 to games in production
section.editField('games').name('games')//change test12345 to games in production
}) as MigrationFunction;