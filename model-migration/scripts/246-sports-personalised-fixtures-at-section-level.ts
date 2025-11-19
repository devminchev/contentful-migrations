import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
    const dxView = migration.editContentType('dxView');

    // Primary Content:
    dxView.editField('primaryContent').items({
        type: "Link",
        linkType: "Entry",
        validations: [
            {
                linkContentType: [ 
                    "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxPromotionDetails", "dxTabs", "dxPromotions", "dxBanners", "dxContent", "sportsMatchList", "dxTheme", "sportsPersonalisedFixtures" 
                ],
            },
        ],
    });

    // Secondary Content:
    dxView.editField('secondaryContent').items({
        type: "Link",
        linkType: "Entry",
        validations: [
            {
                linkContentType: [ 
                    "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxTabs", "dxContent", "dxTheme", "sportsPersonalisedFixtures", "sportsMatchList"
                ],
            },
        ],
    });

}) as MigrationFunction;