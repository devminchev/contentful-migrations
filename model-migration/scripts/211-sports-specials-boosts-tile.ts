import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {
    const LOCALE = space?.spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

    // Sports Specials Boosts Tile

    const sportsSpecialsBoostsTile = migration.createContentType('sportsMarqueeSpecialsBoostsTile').name('Sports Marquee Specials Boosts Tile').displayField('entryTitle')
        .description('Sports tile responsible for displaying PR specials within the marquee.')

    sportsSpecialsBoostsTile.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

    sportsSpecialsBoostsTile.createField('groupPath').name('Group Path').type('Symbol').required(true);
    sportsSpecialsBoostsTile.changeFieldControl('groupPath', 'builtin', 'singleLine', {
        helpText: 'The group path the selected special belongs to.'
    });

    sportsSpecialsBoostsTile.createField('fixtureId').name('Fixture Id').type('Symbol').required(true);
    sportsSpecialsBoostsTile.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
        helpText: 'The Fixture Id the selection belongs to.',
    });

    sportsSpecialsBoostsTile.createField('marketTypeId').name('Market Type Id').type('Symbol').required(true);
    sportsSpecialsBoostsTile.changeFieldControl('marketTypeId', 'builtin', 'singleLine', {
        helpText: 'The market type Id the selected market belongs to.',
    });

    sportsSpecialsBoostsTile.createField('marketSpecifierId').name('Market Specifier Id').type('Symbol').required(true);
    sportsSpecialsBoostsTile.changeFieldControl('marketSpecifierId', 'builtin', 'singleLine', {
        helpText: 'The market specifier Id the selected market belongs to.',
    });

    sportsSpecialsBoostsTile.createField('selectionId').name('Selection Id').type('Symbol').required(true);
    sportsSpecialsBoostsTile.changeFieldControl('selectionId', 'builtin', 'singleLine', {
        helpText: 'The Id of the selection.',
    });

    sportsSpecialsBoostsTile.createField('description').name('Description').type('Symbol').required(false).localized(true);
    sportsSpecialsBoostsTile.changeFieldControl('description', 'builtin', 'singleLine', {
        helpText: 'Override the selection description as these can sometimes be too long.',
    });

    // Update the Marquee Items to include the Sports Specials Boosts Tile

    const dxMarquee = migration.editContentType('dxMarquee');
    dxMarquee.editField('marqueeItems').items({
        type: 'Link',
        linkType: 'Entry',
        validations: [
            {
                linkContentType: [
                    'dxMarqueeCustomTile',
                    'dxMarqueeBrazeTile',
                    'sportsMarqueePrePackTile',
                    'dxPromotionContentCard',
                    'sportsMarqueeKambiPrePackTile',
                    'dxBrazePromotionContentCard',
                    'sportsMarqueeScoreboardTile',
                    'sportsMarqueeSingleSelectionTile',
                    'sportsMarqueeSixPackTile',
                    'dxPlayerRewardsTile',
                    'sportsMarqueeSpecialsBoostsTile'
                ],
            },
        ],
    });

}) as MigrationFunction;