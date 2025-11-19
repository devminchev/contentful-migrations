import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsMarqueeKambiPrePackTile = migration.editContentType('sportsMarqueeKambiPrePackTile');

  sportsMarqueeKambiPrePackTile.changeFieldControl('prePackTags', 'builtin', 'checkbox', {
    helpText: 'PrePack Tags used for Filtering PrePacks. AUTO - Created by Kambi with one selection, AUTO_BUNDLED - Created by Kambi with more then one selection',
  });

  sportsMarqueeKambiPrePackTile.changeFieldControl('prePackIds', 'builtin', 'tagEditor', {
    helpText: 'Specific PrePack ID(s) to be used within the tile.',
  });

}) as MigrationFunction;