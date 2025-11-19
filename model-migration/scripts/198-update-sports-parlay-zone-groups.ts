import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

    const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

    // Sports PrePack Tab Group
    const sportsPrePackTabGroup = migration.editContentType('sportsPrePackTabGroup');

    sportsPrePackTabGroup.createField('daysRange').name('Days Range').type('Number').defaultValue({ [LOCALE]: 7 })

    sportsPrePackTabGroup.changeFieldControl('daysRange', 'builtin', 'numberEditor', {
        helpText: 'The tab will only be shown if there are fixtures within the specified number of days. If 0 or empty, it will show the tab if there are fixtures at any date.',
    });

    sportsPrePackTabGroup.moveField('daysRange').afterField('numOfFixtures');

    // Sports Parlay Builder Tab Group
    const sportsParlayBuilderTabGroup = migration.editContentType('sportsParlayBuilderTabGroup');

    sportsParlayBuilderTabGroup.createField('daysRange').name('Days Range').type('Number').defaultValue({ [LOCALE]: 7 })

    sportsParlayBuilderTabGroup.changeFieldControl('daysRange', 'builtin', 'numberEditor', {
        helpText: 'The tab will only be shown if there are fixtures within the specified number of days. If 0 or empty, it will show the tab if there are fixtures at any date.',
    });

    sportsParlayBuilderTabGroup.moveField('daysRange').afterField('tabItemCount');

    // Sports PrePack Generator Tab Item
    const sportsPrePackGeneratorTabItem = migration.editContentType('sportsPrePackGeneratorTabItem');

    sportsPrePackGeneratorTabItem.createField('daysRange').name('Days Range').type('Number').defaultValue({ [LOCALE]: 7 })

    sportsPrePackGeneratorTabItem.changeFieldControl('daysRange', 'builtin', 'numberEditor', {
        helpText: 'The tab will only be shown if there are fixtures within the specified number of days. If 0 or empty, it will show the tab if there are fixtures at any date.',
    });

    sportsPrePackGeneratorTabItem.moveField('daysRange').afterField('groupCount');
}) as MigrationFunction;