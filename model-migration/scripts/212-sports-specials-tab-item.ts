import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    // Sports Specials Tab Item
    const sportsSpecialsTabItem = migration.createContentType('sportsSpecialsTabItem').name('Sports Specials Tab Item').description('The Sports Specials Tab Item is a tab type used to display PR Bets fixtures or SPS Boosted pre-packs.').displayField('entryTitle');
    sportsSpecialsTabItem.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

    sportsSpecialsTabItem
        .createField('name')
        .name('Name')
        .type('Symbol')
        .required(true)
    sportsSpecialsTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
        helpText: 'Name of the tab to be displayed by the frontend.'
    });

    sportsSpecialsTabItem
        .createField('groupPath')
        .name('Group Path')
        .type('Symbol')
        .required(true)
    sportsSpecialsTabItem.changeFieldControl('groupPath', 'builtin', 'singleLine', {
        helpText: 'The group path the specials tab belongs to.'
    });

    sportsSpecialsTabItem.createField('image')
        .name('Image')
        .type('Object')
        .required(false)
        .validations([
            {
                size: { max: 1 }
            }
        ]);
    sportsSpecialsTabItem.changeFieldControl('image', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
        helpText: 'The Bynder image used as the icon for the tab.',
    });

    sportsSpecialsTabItem
        .createField('specialsType')
        .name('Specials Type')
        .type('Symbol')
        .required(true)
        .validations(
            [
                {
                    "in": [
                        "PR",
                        "SPS"
                    ]
                }
            ],
        )
    sportsSpecialsTabItem.changeFieldControl('specialsType', 'builtin', 'dropdown', {
        helpText: 'Select the type of Specials this tab item belongs to.',
    });

    sportsSpecialsTabItem
        .createField('count')
        .name('Count')
        .type('Integer')
        .required(false)
        .validations(
            [
              {
                "range": {
                  "min": 1
                }
              }
            ]
          );


    sportsSpecialsTabItem.changeFieldControl('count', 'builtin', 'numberEditor', {
        helpText: 'The number of boosted pre-packs to be shown per fixture.'
    });

    // Adding a reference field to the sportsSpecialsTabItem for the dxTabsGroup

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
                    "sportsDynamicEventListingTabItem",
                    "sportsPrePackGeneratorTabItem",
                    "sportsPrePackTabItem",
                    "sportsSpecialsTabItem",
                    "sportsMatchList",
                    "dxTabItem",
                ],
            },
        ],
    });

}) as MigrationFunction;
