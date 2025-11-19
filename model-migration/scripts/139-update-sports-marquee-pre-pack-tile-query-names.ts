import Migration, { MigrationContext, MigrationFunction } from 'contentful-migration';

export = ((migration: Migration, space: MigrationContext) => {

  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  // Sports Marquee PrePack Tile
  const sportsMarqueePrePack = migration.editContentType('sportsMarqueePrePackTile');

  sportsMarqueePrePack
    .editField('queryType')
    .type('Symbol')
    .validations(
      [
        {
          "in": [
            "popularPrePacks",
            "recommendedParlayPrePacks",
            "recommendedSGPPrePacks",
            "recommendedSGPPrePacksForFixture"
          ]
        }
      ],
    )
    .defaultValue({
      [LOCALE]: 'popularPrePacks'
    });

  sportsMarqueePrePack.changeFieldControl('queryType', 'builtin', 'dropdown', {
    helpText: 'Select the query the front end will be making for prepacks. This selection may add extra fields that will need to be entered.',
  });

  sportsMarqueePrePack.moveField('queryType').afterField('entryTitle');

}) as MigrationFunction;