import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsEventGroupings = migration.editContentType('sportsEventGroupings');

  sportsEventGroupings.editField('limitGroupsPerParent').name('Limit Groups Per Parent');
  sportsEventGroupings.editField('limitFixturesPerGroup').name('Limit Fixtures Per Group');

  const sportsFixtureSGPTabItem = migration.editContentType('sportsFixtureSgpTabItem');
  sportsFixtureSGPTabItem.editField('components').name('Components');

  const sportsMarqueeKambiPrePackTile = migration.editContentType('sportsMarqueeKambiPrePackTile');
  sportsMarqueeKambiPrePackTile.editField('prePackIds').name('PrePack Ids');

  const sportsParlayBuilderTabGroup = migration.editContentType('sportsParlayBuilderTabGroup');
  sportsParlayBuilderTabGroup.editField('name').name('Name');
  sportsParlayBuilderTabGroup.editField('tabItemCount').name('Tab Item Count');
  sportsParlayBuilderTabGroup.editField('overrides').name('Overrides');

  const sportsPersonalisedGroupOverride = migration.editContentType('sportsPersonalisedGroupOverride');
  sportsPersonalisedGroupOverride.editField('path').name('Path');
  sportsPersonalisedGroupOverride.editField('sortOrder').name('Sort Order');

  const sportsPrePackGeneratorTabItem = migration.editContentType('sportsPrePackGeneratorTabItem');
  sportsPrePackGeneratorTabItem.editField('defaultLegs').name('Default Legs');
  sportsPrePackGeneratorTabItem.editField('groupCount').name('Group Count');
  sportsPrePackGeneratorTabItem.editField('overrides').name('Overrides');

  const sportsPrePackTabGroup = migration.editContentType('sportsPrePackTabGroup');
  sportsPrePackTabGroup.editField('name').name('Name');
  sportsPrePackTabGroup.editField('prePackType').name('PrePack Type');
  sportsPrePackTabGroup.editField('tabItemCount').name('Tab Item Count');
  sportsPrePackTabGroup.editField('sportIds').name('Sport Ids');
  sportsPrePackTabGroup.editField('overrides').name('Overrides');
  sportsPrePackTabGroup.editField('prePackCount').name('PrePack Count');
  sportsPrePackTabGroup.editField('legs').name('Legs');
  sportsPrePackTabGroup.editField('numOfFixtures').name('Number of Fixtures');

}) as MigrationFunction;