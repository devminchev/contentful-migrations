import { MigrationFunction } from "contentful-migration";

export = ((migration, space) => {
    const LOCALE = space?.spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

    const sportsMarqueePrePackTile = migration.editContentType('sportsMarqueePrePackTile');

    sportsMarqueePrePackTile
        .createField('segmentation')
        .name('Segmentation')
        .type('Array')
        .localized(false)
        .required(true)
        .items({
            type: 'Symbol',
            validations: [
                {
                    in: ['showWhenLoggedIn', 'showWhenLoggedOut'],
                },
            ]
        })
        .defaultValue({
            [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
          });
    sportsMarqueePrePackTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
        helpText: 'The segment(s) where the Sports Marquee PrePack tile should be active',
    })

}) as MigrationFunction;