import { MigrationFunction } from "contentful-migration";

export =((migration) => {
    const sportsSpecialsTabItem = migration.editContentType('sportsSpecialsTabItem');
    sportsSpecialsTabItem.editField('name').localized(true);
}) as MigrationFunction;