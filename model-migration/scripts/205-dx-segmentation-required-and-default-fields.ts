import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {
  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  //sportsMarqueeSingleSelectionTile
  const sportsMarqueeSingleSelectionTile = migration.editContentType('sportsMarqueeSingleSelectionTile');

  sportsMarqueeSingleSelectionTile
    .editField('segmentation')
    .required(true)
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });
  sportsMarqueeSingleSelectionTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the sports marquee single selection tile should be active',
  });

  //sportsMarqueeSixPackTile
  const sportsMarqueeSixPackTile = migration.editContentType('sportsMarqueeSixPackTile');

  sportsMarqueeSixPackTile
    .editField('segmentation')
    .required(true)
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });
  sportsMarqueeSixPackTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the sports marquee six pack tile should be active',
  });

  //dxLink
  const dxLink = migration.editContentType('dxLink');

  dxLink
    .editField('segmentation')
    .required(true)
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });
  dxLink.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the dx link should be active',
  });

  //dxMarqueeCustomTile
  const dxMarqueeCustomTile = migration.editContentType('dxMarqueeCustomTile');

  dxMarqueeCustomTile
    .editField('segmentation')
    .required(true)
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });
  dxMarqueeCustomTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the sports marquee custom tile should be active',
  });

  //dxTabsGroup
  const dxTabsGroup = migration.editContentType('dxTabsGroup');

  dxTabsGroup
    .editField('segmentation')
    .required(true)
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });
  dxTabsGroup.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the dx tabs group should be active',
  });

  //sportsPrePackTabGroup
  const sportsPrePackTabGroup = migration.editContentType('sportsPrePackTabGroup');

  sportsPrePackTabGroup
    .editField('segmentation')
    .required(true)
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });
  sportsPrePackTabGroup.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the sports prepack tab group should be active',
  });

  //sportsParlayBuilderTabGroup
  const sportsParlayBuilderTabGroup = migration.editContentType('sportsParlayBuilderTabGroup');

  sportsParlayBuilderTabGroup
    .editField('segmentation')
    .required(true)
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });
  sportsParlayBuilderTabGroup.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the sports parlay builder tab group should be active',
  });

  //sportsWidget
  const sportsWidget = migration.editContentType('sportsWidget');

  sportsWidget
    .editField('segmentation')
    .required(true)
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });
  sportsWidget.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the sports widget should be active',
  });

  //sportsMarqueeScoreboardTile
  const sportsMarqueeScoreboardTile = migration.editContentType('sportsMarqueeScoreboardTile');

  sportsMarqueeScoreboardTile
    .editField('segmentation')
    .required(true)
    .defaultValue({
      [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
    });
  sportsMarqueeScoreboardTile.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the sports marquee scoreboard tile should be active',
  });

    //dxComponentHeader
    const dxComponentHeader = migration.editContentType('dxComponentHeader');

    dxComponentHeader
      .editField('segmentation')
      .required(true)
      .defaultValue({
        [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
      });
      dxComponentHeader.changeFieldControl('segmentation', 'builtin', 'checkbox', {
      helpText: 'The segment(s) where the dx component header should be active',
    });

    //dxTabItem
    const dxTabItem = migration.editContentType('dxTabItem');

    dxTabItem
      .editField('segmentation')
      .required(true)
      .defaultValue({
        [LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
      });
      dxTabItem.changeFieldControl('segmentation', 'builtin', 'checkbox', {
      helpText: 'The segment(s) where the dx tab item should be active',
    });

}) as MigrationFunction;