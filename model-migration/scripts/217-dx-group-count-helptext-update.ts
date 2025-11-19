import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
    const sportsPrePackGeneratorTabItem = migration.editContentType('sportsPrePackGeneratorTabItem');
    sportsPrePackGeneratorTabItem.changeFieldControl('groupCount', 'builtin', 'numberEditor', {
        helpText: "This number is how many leagues/competitions we request from VAIX to be shown in the generator tab's filters and does not include overrides. VAIX may return less competitions than specified."
    })
 
}) as MigrationFunction;