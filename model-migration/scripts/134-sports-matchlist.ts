import { MigrationFunction } from 'contentful-migration';


export = ((migration) => {

    // Create Sports Fixture model

    const sportsFixture = migration
        .createContentType('sportsFixture')
        .name('Sports Fixture')
        .description('Sports Component for a fixture')
        .displayField('entryTitle');

    sportsFixture.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
    sportsFixture.createField('fixtureId').name('Fixture ID').type('Symbol').required(true);
    sportsFixture.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
        helpText: 'The ID corresponding to the fixture in the sports data platform.',
    });

    // Create Sports Group model

    const sportsGroupFixtures = migration
        .createContentType('sportsGroup')
        .name('Sports Group')
        .description('Sports Component for a group of fixtures')
        .displayField('entryTitle');

    sportsGroupFixtures.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
    sportsGroupFixtures.createField('path').name('Path').type('Symbol').required(true);
    sportsGroupFixtures.changeFieldControl('path', 'builtin', 'singleLine', {
        helpText: 'The group path this entry refers to. E.g. football/england',
    });

    // Create Sports Match List model

    const sportsMatchList = migration
        .createContentType('sportsMatchList')
        .name('Sports Match List')
        .description('Sports Component showcasing the Math List model')
        .displayField('entryTitle');

    sportsMatchList.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

    sportsMatchList.createField('name').name('Name').type('Symbol').localized(true).required(true);

    sportsMatchList.changeFieldControl('name', 'builtin', 'singleLine', {
        helpText: 'The title displayed on the Match List on the front end.',
    });

    sportsMatchList.createField('icon')
        .name('Icon')
        .type('Object')
        .validations([
            {
                size: { max: 1 }
            }
        ]);
    sportsMatchList.changeFieldControl('icon', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
        helpText: 'The Bynder image to be used as an icon within the Sports Match List.',
    });

    sportsMatchList
        .createField('matchList')
        .required(true)
        .name('Match List')
        .type('Array')
        .items({
            type: 'Link',
            linkType: 'Entry',
            validations: [
                {
                    linkContentType: ['sportsGroup', 'sportsFixture']
                }
            ]
        })

    sportsMatchList.changeFieldControl('matchList', 'builtin', 'entryLinksEditor', {
        helpText: 'The custom collection of fixture Ids or groups for this Match List.',
    });

    sportsMatchList
        .createField("showMarketSwitcher")
        .name("Show Market Switcher")
        .type("Boolean")
        .localized(false)
        .required(true)
        .defaultValue({
            "en-US": true
        });

    sportsMatchList.changeFieldControl("showMarketSwitcher", "builtin", "radio", {
        helpText:
            "Used to determine whether to display the market switcher within the tab, as a sub filter, or whether to restrict the display to a long list of markets",
    });

    sportsMatchList
        .createField('groupViewFilter')
        .name('Group View Filter')
        .type('Link')
        .linkType('Entry')
        .validations([
            {
                linkContentType: ['sportsEventGroupings']
            }
        ])

    sportsMatchList.changeFieldControl('groupViewFilter', 'builtin', 'entryLinkEditor', {
        helpText: "Display logic used by the Match List's groups to determine fixture quantities, etc."
    });

    sportsMatchList.createField('minFixtures').name('Minimum Fixtures').type('Number').required(true)
    sportsMatchList.changeFieldControl('minFixtures', 'builtin', 'numberEditor', {
        helpText: 'The minimum number of fixtures required for the Match List to be displayed on the front end',
    });

    // Add Sports Match List to Dx View - Primary Content

    const dxView = migration.editContentType('dxView');

    dxView.editField('primaryContent').items({
        type: "Link",
        linkType: "Entry",
        validations: [
            {
                linkContentType: [
                    "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxPromotionDetails", "dxTabs", "dxPromotions", "dxBanners", "dxContent", "sportsMatchList"
                ],
            },
        ],
    });

    // Add Sports Match List to Dx Tabs Group - Dx Tab Items

    const dxTabsGroup = migration.editContentType('dxTabsGroup');
    dxTabsGroup.editField('dxTabItems').items({
        type: 'Link',
        linkType: 'Entry',
        validations: [
            {
                linkContentType: [
                    "sportsEventListingTabItem",
                    "sportsFixtureKambiPrePackTabItem",
                    "sportsFixtureMarketsTabItem",
                    "sportsFixtureSgpTabItem",
                    "sportsFuturesTabItem",
                    "sportsNavigationTabItem",
                    "sportsParlayBuilderTabItem",
                    "sportsPersonalisedEventListingTabItems",
                    "sportsPrePackGeneratorTabItem",
                    "sportsPrePackTabItem",
                    "sportsMatchList"
                ],
            },
        ],
    });

}) as MigrationFunction;
