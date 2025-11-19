import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const layout = migration.editContentType('layout');
  layout.editField('sections').validations([]);
}) as MigrationFunction;
