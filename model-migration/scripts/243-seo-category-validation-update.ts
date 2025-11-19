import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
  const seoCategory = migration.editContentType('seoCategory');

  seoCategory
    .editField('tag')
    .validations([
      {
        regexp: {
          pattern: "^[a-z0-9-]*$"
        }
      }
    ]);

}) as MigrationFunction;
