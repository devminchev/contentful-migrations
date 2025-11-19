import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  const dxView = migration.editContentType('dxView');
  dxView.changeFieldControl('paths', 'builtin', 'tagEditor', {
    helpText: "Used to determine which group or fixture pages this view should apply to. Only required for views with a key of 'group' or 'fixture'. Example: football or football/england/premier_league"
  });

  const dxLink = migration.editContentType('dxLink');
  dxLink.changeFieldControl('url', 'builtin', 'singleLine', {
    helpText: "Enter Either a full URL if the link is to an external page e.g https://www.google.com or provide a relative path e.g /account/cookies-policy if the relative path is a sports group then please update the Link Type field."
  });

  const dxBanner = migration.editContentType('dxBanner');
  dxBanner.changeFieldControl('url', 'builtin', 'singleLine', {
    helpText: "Enter Either a full URL if the link is to an external page e.g https://www.google.com or provide a relative path e.g /casino/game-launch/PARSECRETSOFTHEPHOENIX"
  });

  const dxControlledBanner = migration.editContentType('dxControlledBanner');
  dxControlledBanner.changeFieldControl('url', 'builtin', 'singleLine', {
    helpText: "Enter Either a full URL if the link is to an external page e.g https://www.google.com or provide a relative path e.g /casino/game-launch/PARSECRETSOFTHEPHOENIX"
  });

  const dxMarqueeCustomTile = migration.editContentType('dxMarqueeCustomTile');
  dxMarqueeCustomTile.changeFieldControl('url', 'builtin', 'singleLine', {
    helpText: "ONLY to be used if buttons aren't desired - Makes whole marquee a clickable area. ENTER EITHER a full URL if the link is to an external page e.g https://www.google.com or provide a relative path e.g /casino/game-launch/PARSECRETSOFTHEPHOENIX"
  });

  const sportsEventListingTabItem = migration.editContentType('sportsEventListingTabItem');
  sportsEventListingTabItem.editField('path')
    .defaultValue({
      [LOCALE]: '{{path}}'
    })
  sportsEventListingTabItem.changeFieldControl('path', 'builtin', 'singleLine', {
    helpText: 'Enter in {{path}} or to override use the group path or fixture ID the sports data view endpoint will be returning in relation to Kambi data e.g. football/england/premier_league'
  });

  const sportsFuturesTabItem = migration.editContentType('sportsFuturesTabItem');
  sportsFuturesTabItem.editField('path')
    .defaultValue({
      [LOCALE]: '{{path}}'
    })
    sportsFuturesTabItem.changeFieldControl('path', 'builtin', 'singleLine', {
    helpText: 'Used to determine which group or sport pages the future tabs should apply to. Enter in {{path}} or to override use the group path the sports data view endpoint will be returning in relation to Kambi data e.g. football/england/premier_league'
  });

}) as MigrationFunction;