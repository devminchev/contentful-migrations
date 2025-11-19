import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsMarqueeSpecialsPrepackTile = migration.editContentType('sportsMarqueeSpecialsPrePackTile');
  
  sportsMarqueeSpecialsPrepackTile.deleteField('backgroundImage');

}) as MigrationFunction; 
