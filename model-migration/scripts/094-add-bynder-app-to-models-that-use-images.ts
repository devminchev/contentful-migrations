import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {

  const dxBanner = migration.editContentType('dxBanner');
  dxBanner.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
  // 5KySdUzG7OWuCE2V3fgtIa is the ID for the Bynder Image App
  dxBanner.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for the Dx Banner',
  });
  dxBanner.moveField('bynderImage').afterField('image');

  const dxLink = migration.editContentType('dxLink');
  dxLink.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
  dxLink.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for the Dx Link',
  });
  dxLink.moveField('bynderImage').afterField('image');

  const dxMarqueeCustomTile = migration.editContentType('dxMarqueeCustomTile');
  dxMarqueeCustomTile.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
    dxMarqueeCustomTile.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for the Dx Marquee Custom Tile',
  });
  dxMarqueeCustomTile.moveField('bynderImage').afterField('image');

  const sportsEventListingTabItem = migration.editContentType('sportsEventListingTabItem');
  sportsEventListingTabItem.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
    sportsEventListingTabItem.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for the Sports Event Listing Tab Item',
  });
  sportsEventListingTabItem.moveField('bynderImage').afterField('image');

  const sportsNavigationTabItem = migration.editContentType('sportsNavigationTabItem');
  sportsNavigationTabItem.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
    sportsNavigationTabItem.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for the Sports Navigation Tab Item',
  });
  sportsNavigationTabItem.moveField('bynderImage').afterField('image');

  const sportsPrePackGeneratorTabItem = migration.editContentType('sportsPrePackGeneratorTabItem');
  sportsPrePackGeneratorTabItem.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
    sportsPrePackGeneratorTabItem.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for the Sports Pre Pack Generator Tab Item',
  });
  sportsPrePackGeneratorTabItem.moveField('bynderImage').afterField('image');

  const sportsSport = migration.editContentType('sportsSport');
  sportsSport.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
    sportsSport.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for Sports Sport',
  });
  sportsSport.moveField('bynderImage').afterField('image');

  const sportsParlayBuilderTabItem = migration.editContentType('sportsParlayBuilderTabItem');
  sportsParlayBuilderTabItem.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
    sportsParlayBuilderTabItem.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for Sports Parlay Builder Tab Item',
  });
  sportsParlayBuilderTabItem.moveField('bynderImage').afterField('image');

  const sportsPrePackTabItem = migration.editContentType('sportsPrePackTabItem');
  sportsPrePackTabItem.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
    sportsPrePackTabItem.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for Sports Pre Pack Tab Item',
  });
  sportsPrePackTabItem.moveField('bynderImage').afterField('image');

  const sportsParticipant = migration.editContentType('sportsParticipant');
  sportsParticipant.editField('logo')
  .validations([
    {
      size: { max: 1 }
    }
  ]);
  sportsParticipant.editField('alternativeLogo')
  .validations([
    {
      size: { max: 1 }
    }
  ]);

}) as MigrationFunction;