import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    // Sports Parlay Builder Tab Group
    const sportsParlayBuilderTabGroup = migration.editContentType('sportsParlayBuilderTabGroup');
    sportsParlayBuilderTabGroup.editField('tabItemCount')
    sportsParlayBuilderTabGroup.changeFieldControl('tabItemCount', 'builtin', 'numberEditor', {
      helpText: "The number of personalised competition tabs to display."
    });
    sportsParlayBuilderTabGroup.editField('overrides')
    sportsParlayBuilderTabGroup.changeFieldControl('overrides', 'builtin', 'entryLinksEditor', {
      helpText: "Sports Personalised Group Override component can be used to apply overrides to the recommended groups returned from VAIX. Groups can be inserted and the sort order of the overrides can be set."
    });
    sportsParlayBuilderTabGroup.editField('uiStyle')
    sportsParlayBuilderTabGroup.changeFieldControl('uiStyle', 'builtin', 'entryLinkEditor', {
      helpText: "Configure how tabItems are displayed for this Tab Group."
    });

    // Sports Parlay Builder Tab Item
    const sportsParlayBuilderTabItem = migration.editContentType('sportsParlayBuilderTabItem');
    sportsParlayBuilderTabItem.description('A sports parlay builder tab item is used to display a set of popular pre-packs and a set of recommended pre-packs for recommended leagues i.e. NFL, NBA, MLB.');

    // Dx Tabs Group
    const dxTabsGroup = migration.editContentType('dxTabsGroup');
    dxTabsGroup.editField('uiStyle')
    dxTabsGroup.changeFieldControl('uiStyle', 'builtin', 'entryLinkEditor', {
      helpText: "Configure how tabItems are displayed for this Tab Group."
    });

    // Sports PrePack Tab Group
    const sportsPrePackTabGroup = migration.editContentType('sportsPrePackTabGroup');
    sportsPrePackTabGroup.editField('prePackType')
    sportsPrePackTabGroup.changeFieldControl('prePackType', 'builtin', 'singleLine', {
      helpText: "The type of pre-pack i.e. SGP or PARLAY"
    });
    sportsPrePackTabGroup.editField('tabItemCount')
    sportsPrePackTabGroup.changeFieldControl('tabItemCount', 'builtin', 'numberEditor', {
      helpText: "The number of personalised competition tabs to display."
    });
    sportsPrePackTabGroup.editField('sportIds')
    sportsPrePackTabGroup.changeFieldControl('sportIds', 'builtin', 'tagEditor', {
      helpText: "The sports to limit the competition tabs to."
    });
    sportsPrePackTabGroup.editField('overrides')
    sportsPrePackTabGroup.changeFieldControl('overrides', 'builtin', 'entryLinksEditor', {
      helpText: "Sports Personalised Group Override component can be used to apply overrides to the recommended groups returned from VAIX. Groups can be inserted and the sort order of the overrides can be set."
    });
    sportsPrePackTabGroup.editField('prePackCount')
    sportsPrePackTabGroup.changeFieldControl('prePackCount', 'builtin', 'numberEditor', {
      helpText: "The number of recommended bets to display."
    });
    sportsPrePackTabGroup.editField('legs')
    sportsPrePackTabGroup.changeFieldControl('legs', 'builtin', 'numberEditor', {
      helpText: "The number of selections in each bet to display."
    });
    sportsPrePackTabGroup.editField('numOfFixtures')
    sportsPrePackTabGroup.changeFieldControl('numOfFixtures', 'builtin', 'numberEditor', {
      helpText: "SGP ONLY - The number of distinct fixtures to display under each tab."
    });
    sportsPrePackTabGroup.editField('uiStyle')
    sportsPrePackTabGroup.changeFieldControl('uiStyle', 'builtin', 'entryLinkEditor', {
      helpText: "Configure how tabItems are displayed for this Tab Group."
    });

    // Sports PrePack Tab Item
    const sportsPrePackTabItem = migration.editContentType('sportsPrePackTabItem');
    sportsPrePackTabItem.editField('name')
    sportsPrePackTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
      helpText: "The tab items name displayed to the user"
    });

    // Sports Marquee PrePack Tile
    const sportsMarqueePrePackTile = migration.editContentType('sportsMarqueePrePackTile');
    sportsMarqueePrePackTile.editField('prePackType')
    sportsMarqueePrePackTile.changeFieldControl('prePackType', 'builtin', 'singleLine', {
      helpText: "The type of pre-pack i.e. SGP or PARLAY"
    });
    sportsMarqueePrePackTile.editField('count')
    sportsMarqueePrePackTile.changeFieldControl('count', 'builtin', 'numberEditor', {
      helpText: "The number of personalised bets to display in the carousel."
    });
    sportsMarqueePrePackTile.editField('legs')
    sportsMarqueePrePackTile.changeFieldControl('legs', 'builtin', 'numberEditor', {
      helpText: "The number of selections in each bet to display in the carousel."
    });

    // Sports Personalised Group Override
    const sportsPersonalisedGroupOverride = migration.editContentType('sportsPersonalisedGroupOverride');
    sportsPersonalisedGroupOverride.editField('path')
    sportsPersonalisedGroupOverride.changeFieldControl('path', 'builtin', 'singleLine', {
      helpText: "The group path for the Override. e.g 'american_football/nfl'"
    });
    sportsPersonalisedGroupOverride.editField('sortOrder')
    sportsPersonalisedGroupOverride.changeFieldControl('sortOrder', 'builtin', 'numberEditor', {
      helpText: "The order or position to place the Override. i.e. '1' will put the Override in 1st position."
    });

    // Sports PrePack Generator Tab Item
    const sportsPrePackGeneratorTabItem = migration.editContentType('sportsPrePackGeneratorTabItem');
    sportsPrePackGeneratorTabItem.editField('name')
    sportsPrePackGeneratorTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
      helpText: "The tab items name displayed to the user."
    });
    sportsPrePackGeneratorTabItem.editField('image')
    sportsPrePackGeneratorTabItem.changeFieldControl('image', 'builtin', 'singleLine', {
      helpText: "Absolute or relative URL to the image / icon."
    });
    sportsPrePackGeneratorTabItem.editField('groupCount')
    sportsPrePackGeneratorTabItem.changeFieldControl('groupCount', 'builtin', 'numberEditor', {
      helpText: "The number of competitions to recommend to the user."
    });
    sportsPrePackGeneratorTabItem.editField('defaultLegs')
    sportsPrePackGeneratorTabItem.changeFieldControl('defaultLegs', 'builtin', 'numberEditor', {
      helpText: "The default number of selections to generate."
    });
    sportsPrePackGeneratorTabItem.editField('overrides')
    sportsPrePackGeneratorTabItem.changeFieldControl('overrides', 'builtin', 'entryLinksEditor', {
      helpText: "Sports Personalised Group Override component can be used to apply overrides to the recommended groups returned from VAIX. Groups can be inserted and the sort order of the overrides can be set."
    });

    // Dx Header
    const dxHeader = migration.editContentType('dxHeader');
    dxHeader.editField('title')
    dxHeader.changeFieldControl('title', 'builtin', 'singleLine', {
      helpText: "Title of the page to be displayed in the Header."
    });
    dxHeader.editField('showBackButton')
    dxHeader.changeFieldControl('showBackButton', 'builtin', 'radio', {
      helpText: "To display the back button or not in the header. NB. This will be deprecated once we have moved away from the Kambi Client."
    });
    dxHeader.editField('showSwitcher')
    dxHeader.changeFieldControl('showSwitcher', 'builtin', 'radio', {
      helpText: "To display the group switcher or not in the header."
    });

    // Dx Tabs
    const dxTabs = migration.editContentType('dxTabs');
    dxTabs.editField('uiStyle')
    dxTabs.changeFieldControl('uiStyle', 'builtin', 'entryLinkEditor', {
      helpText: "Configure how this Tab Group is displayed."
    });

  }) as MigrationFunction;