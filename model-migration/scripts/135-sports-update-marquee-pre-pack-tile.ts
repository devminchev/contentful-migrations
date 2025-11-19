import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	const sportsMarqueePrePack = migration.editContentType('sportsMarqueePrePackTile');

  sportsMarqueePrePack.editField('entryTitle').required(true);

  sportsMarqueePrePack.editField('prePackType')
  .name('Pre-Pack Type')
  .required(false)
  .validations([
    {
      regexp: {
        pattern: "^((SGP)|(PARLAY))$"
      }
    }
  ]);
  sportsMarqueePrePack.changeFieldControl('prePackType', 'builtin', 'singleLine', {
    helpText: 'REQUIRED for popularSGPPrepacks. The type of pre-pack to be used i.e. SGP or PARLAY',
  });
  sportsMarqueePrePack.moveField('prePackType').afterField('legs');

  sportsMarqueePrePack.editField('count').name('Count');
  sportsMarqueePrePack.changeFieldControl('count', 'builtin', 'numberEditor', {
    helpText: 'The number of pre packs to display within the carousel. Needs to be between 2 and 20 inclusive.',
  });

  sportsMarqueePrePack.editField('legs').name('Legs');
  sportsMarqueePrePack.changeFieldControl('legs', 'builtin', 'numberEditor', {
    helpText: 'The number of selections within each bet that is displayed in the carousel. Needs to be between 2 and 10 inclusive.',
  });

  sportsMarqueePrePack
  .createField('queryType')
  .name('Query Type')
  .type('Symbol')
  .validations(
    [
      {
        "in": [
          "popularSGPPrepacks",
          "recommendedParlayPrePacks",
          "recommendedSGPPrepacks",
          "recommendedSGPPrePacksForFixture"
        ]
      }
    ],
  )
  .defaultValue({
    [LOCALE]: 'popularSGPPrepacks'
  });
  sportsMarqueePrePack.changeFieldControl('queryType', 'builtin', 'dropdown', {
    helpText: 'Select the Query that Front End will be making. This selection may add extra fields that will need to be entered.',
  });
  sportsMarqueePrePack.moveField('queryType').afterField('entryTitle');

  sportsMarqueePrePack
  .createField('numOfFixtures')
  .name('Number of Fixtures')
  .type('Integer')
  .required(false)
  .validations(
    [
      {
        "range": {
          "min": 2,
          "max": 50
        }
      }
    ]
  );
  sportsMarqueePrePack.changeFieldControl('numOfFixtures', 'builtin', 'numberEditor', {
    helpText: 'The number of distinct fixtures to display. Needs to be between 2 and 50 inclusive.',
  });

  sportsMarqueePrePack
  .createField('id')
  .name('Id')
  .type('Integer')
  .required(false);
  sportsMarqueePrePack.changeFieldControl('id', 'builtin', 'numberEditor', {
    helpText: 'Enter an Id so a PrePack is returned for that competition/fixture.',
  });

}) as MigrationFunction;