import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
  // Sports Tab Filter
  const sportsTabItem = migration.editContentType("sportsTabItem");

  sportsTabItem
    .editField('innerGrouping')
    .validations([
      {
        in: ['sport', 'region', 'competition', 'date'],
      },
    ]);

  sportsTabItem
    .editField('outerGrouping')
    .validations([
      {
        in: ['live', 'date', 'sport', 'region', 'competition'],
      },
    ]);
}) as MigrationFunction;
