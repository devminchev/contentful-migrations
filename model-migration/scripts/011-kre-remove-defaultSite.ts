import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const venture = migration.editContentType('venture');

  venture.deleteField('defaultSite');
}) as MigrationFunction;
