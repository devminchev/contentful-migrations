import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {

	const sportsMarqueePrePack = migration.editContentType('sportsMarqueePrePackTile');

  sportsMarqueePrePack.changeFieldControl('id', 'builtin', 'numberEditor', {
    helpText: 'Enter an Id so a PrePack is returned for that competition/fixture. If left empty, it will use the Id from the group the user is currently on.',
  });

}) as MigrationFunction;