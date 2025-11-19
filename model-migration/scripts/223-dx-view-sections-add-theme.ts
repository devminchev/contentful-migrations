import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
    // View updates
    const dxView = migration.editContentType('dxView');

    // Top Content
    dxView.editField('topContent').items({
        type: "Link",
        linkType: "Entry",
        validations: [
            {
                linkContentType: [
                    "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxContent", "dxHeader", "dxTheme"
                ],
            },
        ],
    });
    // Primary Content
    dxView.editField('primaryContent').items({
        type: "Link",
        linkType: "Entry",
        validations: [
            {
                linkContentType: [
                    "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxPromotionDetails", "dxTabs", "dxPromotions", "dxBanners", "dxContent", "sportsMatchList", "dxTheme"
                ],
            },
        ],
    });
    // Primary Empty Content
    dxView.editField('primaryEmptyContent').items({
        type: "Link",
        linkType: "Entry",
        validations: [
            {
                linkContentType: [
                    "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxContent", "dxTheme"
                ],
            },
        ],
    });
    // Secondary Content
    dxView.editField('secondaryContent').items({
        type: "Link",
        linkType: "Entry",
        validations: [
            {
                linkContentType: [
                    "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxTabs", "dxContent", "dxTheme"
                ],
            },
        ],
    });
    // Left Navigation Content
    dxView.editField('leftNavigationContent').items({
        type: "Link",
        linkType: "Entry",
        validations: [
            {
                linkContentType: [
                   "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxContent", "dxTheme"
                ],
            },
        ],
    });
}) as MigrationFunction;
