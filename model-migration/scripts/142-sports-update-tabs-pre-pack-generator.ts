import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  
  // Update Sports PrePack Generator Tab Item
  const prePackGeneratorTabItem = migration.editContentType('sportsPrePackGeneratorTabItem')

  
  prePackGeneratorTabItem.changeFieldControl('groupCount', 'builtin', 'numberEditor', {
      helpText: 'This is a fetch number and NOT the total number of leagues/competitions shown to a user. e.g. If this is set to 5, and all 5 recommended leagues/competitions from Vaix are the SAME, then it will show 5. If all 5 are different recommendations, then 10 tiles will show.',
    });

}) as MigrationFunction;
