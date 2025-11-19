import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    const sportsMarqueePrePackTile = migration.editContentType('sportsMarqueePrePackTile');

    sportsMarqueePrePackTile.editField('numOfFixtures')
        .name('No. Of Individual Fixtures')

    sportsMarqueePrePackTile.changeFieldControl('numOfFixtures', 'builtin', 'numberEditor', {
        helpText: "The number of distinct fixtures to show in this prepack block. Number needs to be between 2 and 50.",
    });

    sportsMarqueePrePackTile.changeFieldControl('count', 'builtin', 'numberEditor', {
        helpText: "SGP = No. of prepacks per individual fixture. This times count field is the max no. of prepacks requested. | MGP = Max no. of prepacks requested.",
    });

    sportsMarqueePrePackTile.moveField('count').afterField('numOfFixtures');
    sportsMarqueePrePackTile.moveField('legs').afterField('count');

}) as MigrationFunction;