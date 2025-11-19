import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxBanner = migration.editContentType('dxBanner');
  dxBanner.editField('bynderImage')
    .localized(true);

  const dxLink = migration.editContentType('dxLink');
  dxLink.editField('bynderImage')
    .localized(true);

  const dxMarqueeCustomTile = migration.editContentType('dxMarqueeCustomTile');
  dxMarqueeCustomTile.editField('bynderImage')
    .localized(true);

  const sportsEventListingTabItem = migration.editContentType('sportsEventListingTabItem');
  sportsEventListingTabItem.editField('bynderImage')
    .localized(true);

  const sportsNavigationTabItem = migration.editContentType('sportsNavigationTabItem');
  sportsNavigationTabItem.editField('bynderImage')
    .localized(true);

  const sportsPrePackGeneratorTabItem = migration.editContentType('sportsPrePackGeneratorTabItem');
  sportsPrePackGeneratorTabItem.editField('bynderImage')
    .localized(true);

  const sportsSport = migration.editContentType('sportsSport');
  sportsSport.editField('bynderImage')
    .localized(true);

  const sportsParlayBuilderTabItem = migration.editContentType('sportsParlayBuilderTabItem');
  sportsParlayBuilderTabItem.editField('bynderImage')
    .localized(true);

  const sportsPrePackTabItem = migration.editContentType('sportsPrePackTabItem');
  sportsPrePackTabItem.editField('bynderImage')
    .localized(true);

}) as MigrationFunction;