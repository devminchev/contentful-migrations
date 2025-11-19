import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {
    const LOCALE = space?.spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

    const sportsGridLinks = migration.createContentType('sportsGridLinks').name('Sports Grid Links').displayField('entryTitle')
        .description('A collection of links to be displayed in a grid.')

    sportsGridLinks.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

    sportsGridLinks.createField('name').name('Name').type('Symbol').localized(true).required(true);

    sportsGridLinks.changeFieldControl('name', 'builtin', 'singleLine', {
        helpText: 'The name of the grid to be displayed to the user.'
    });

    sportsGridLinks.createField('links').name('Grid Links').type('Array').items({
        type: 'Link',
        linkType: 'Entry',
        validations: [
            {
                linkContentType: ['dxLink'],
            },
        ],
    });

    sportsGridLinks.changeFieldControl('links', 'builtin', 'entryLinksEditor', {
        helpText: 'Collection of links'
    });

    sportsGridLinks.createField('childGroupCount')
        .name('Child Group Count')
        .type('Number')
        .required(true)
        .defaultValue(({
            [LOCALE]: 0,
        }));

    sportsGridLinks.changeFieldControl('childGroupCount', 'builtin', 'numberEditor', {
        helpText: 'The number of links to child Kambi groups auto populated and shown on the grid, respective of the page the user is on.'
    });

    // Add to Sports Event Listing Tab Item

    const sportsEventListingTabItem = migration.editContentType('sportsEventListingTabItem');

    sportsEventListingTabItem
        .createField('links')
        .name('Links')
        .type('Link')
        .linkType('Entry')
        .validations([
            {
                linkContentType: ['sportsGridLinks']
            }
        ])

    sportsEventListingTabItem.changeFieldControl('links', 'builtin', 'entryLinkEditor', {
        helpText: 'Grid containing links to Coupons and other related pages'
    });

    sportsEventListingTabItem.moveField('links').afterField('path');

}) as MigrationFunction;