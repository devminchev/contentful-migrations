import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

    const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

    const sportsEventListingTabItem = migration.editContentType('sportsEventListingTabItem');

    sportsEventListingTabItem.editField('statuses')
        .defaultValue({
            [LOCALE]: [
                "NOT_STARTED",
                "STARTED"
            ]
        });

    sportsEventListingTabItem.editField('showMarketSwitcher')
    .defaultValue({
        [LOCALE]: true
    });

}) as MigrationFunction;