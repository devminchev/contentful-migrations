import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const gameInfo = migration.createContentType('gameInfo').name('Game Info').description('').displayField('entryTitle');
  gameInfo.createField('entryTitle').name('entryTitle').type('Symbol');
  gameInfo.createField('title').name('title').type('Symbol');
  gameInfo.createField('infoImgUrlPattern').name('infoImgUrlPattern').type('Symbol');
  gameInfo.createField('maxBet').name('maxBet').type('Symbol');
  gameInfo.createField('minBet').name('minBet').type('Symbol');
  gameInfo.createField('representativeColor').name('representativeColor').type('Symbol');
  gameInfo.createField('howToPlayContent').name('howToPlayContent').type('Text');
  gameInfo.createField('infoDetails').name('infoDetails').type('Text');
  gameInfo.createField('introductionContent').name('introductionContent').type('Text');
  gameInfo.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  gameInfo.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'Title of the game',
  });
  gameInfo.changeFieldControl('infoImgUrlPattern', 'builtin', 'singleLine', {
    helpText: 'URL pattern for images that will be displayed alongside the game information',
  });
  gameInfo.changeFieldControl('maxBet', 'builtin', 'singleLine', {
    helpText: 'Maximum monetary bet amount that the game allows',
  });
  gameInfo.changeFieldControl('minBet', 'builtin', 'singleLine', {
    helpText: 'Minimum monetary bet amount that the game allows',
  });
  gameInfo.changeFieldControl('representativeColor', 'builtin', 'singleLine', {
    helpText: 'Colour associated with the game',
  });
  gameInfo.changeFieldControl('howToPlayContent', 'builtin', 'singleLine', {
    helpText: 'HTML copy describing how to play the game',
  });
  gameInfo.changeFieldControl('infoDetails', 'builtin', 'singleLine', {
    helpText: 'HTML copy describing the features of the game',
  });
  gameInfo.changeFieldControl('introductionContent', 'builtin', 'singleLine', {
    helpText: 'HTML copy introducing the game',
  });

  const venture = migration.createContentType('venture').name('Venture').description('').displayField('entryTitle');
  venture.createField('entryTitle').name('entryTitle').type('Symbol');
  venture.createField('name').name('name').type('Symbol');
  venture.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  venture.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'Name of the venture (lowercase)',
  });

  const siteGame = migration.createContentType('siteGame').name('Site Game').description('').displayField('entryTitle');
  siteGame.createField('entryTitle').name('entryTitle').type('Symbol');
  siteGame
    .createField('game')
    .name('game')
    .type('Link')
    .validations([
      {
        linkContentType: ['game'],
      },
    ])
    .linkType('Entry');
  siteGame
    .createField('venture')
    .name('venture')
    .type('Link')
    .validations([
      {
        linkContentType: ['venture'],
      },
    ])
    .linkType('Entry');
  siteGame
    .createField('environment')
    .name('environment')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['staging', 'production'],
        },
      ],
    });
  siteGame.createField('name').name('name').type('Symbol');
  siteGame.createField('demoUrl').name('demoUrl').type('Symbol');
  siteGame.createField('realUrl').name('realUrl').type('Symbol');
  siteGame
    .createField('vendor')
    .name('vendor')
    .type('Symbol')
    .validations([
      {
        in: ['gamesys', 'roxor-rgp', 'lynx', 'engage', 'netent', 'evolution', 'igt'],
      },
    ]);
  siteGame.createField('gameLoaderFileName').name('gameLoaderFileName').type('Symbol');
  siteGame.createField('rgpEnabled').name('rgpEnabled').type('Boolean');
  siteGame.createField('showGameName').name('showGameName').type('Boolean');
  siteGame.createField('fullscreenDisabled').name('fullscreenDisabled').type('Boolean');
  siteGame.createField('funPanelEnabled').name('funPanelEnabled').type('Boolean');
  siteGame.createField('funPanelDefaultCategory').name('funPanelDefaultCategory').type('Symbol');
  siteGame.createField('funPanelBackgroundImage').name('funPanelBackgroundImage').type('Symbol');
  siteGame.createField('supportsCommunityJackpot').name('supportsCommunityJackpot').type('Boolean');
  siteGame.createField('operatorBarDisabled').name('operatorBarDisabled').type('Boolean');
  siteGame.createField('chat').name('chat').type('Object');
  siteGame.createField('gameId').name('gameId').type('Symbol');
  siteGame.createField('page').name('page').type('Symbol');
  siteGame.createField('softwareId').name('softwareId').type('Symbol');
  siteGame.createField('denomAmount').name('denomAmount').type('Symbol');
  siteGame.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  siteGame.changeFieldControl('game', 'builtin', 'entryLinkEditor');
  siteGame.changeFieldControl('venture', 'builtin', 'entryLinkEditor');
  siteGame.changeFieldControl('environment', 'builtin', 'checkbox', {
    helpText: 'The environment(s) where the game is active',
  });
  siteGame.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'Unique name used to identify the game (used in the URL)',
  });
  siteGame.changeFieldControl('demoUrl', 'builtin', 'singleLine', {
    helpText: 'URL to load the game in demo play mode',
  });
  siteGame.changeFieldControl('realUrl', 'builtin', 'singleLine', {
    helpText: 'URL to load the game in real play mode',
  });
  siteGame.changeFieldControl('vendor', 'builtin', 'radio', {
    helpText: 'Which vendor will load the game?',
  });
  siteGame.changeFieldControl('gameLoaderFileName', 'builtin', 'singleLine', {
    helpText: 'Unique ID used to load the game (only required for Gamesys vendor)',
  });
  siteGame.changeFieldControl('rgpEnabled', 'builtin', 'boolean', {
    helpText: 'Should the game be loaded on the RGP? (only required for Gamesys vendor)',
  });
  siteGame.changeFieldControl('showGameName', 'builtin', 'boolean', {
    helpText: 'Should the game name be displayed while playing? (only required for Gamesys vendor)',
  });
  siteGame.changeFieldControl('fullscreenDisabled', 'builtin', 'boolean', {
    helpText: 'Should the fullscreen functionality be disabled when the game loads? (only required for Gamesys vendor)',
  });
  siteGame.changeFieldControl('funPanelEnabled', 'builtin', 'boolean', {
    helpText: 'Does the game support the multi game layout? (only required for Gamesys vendor)',
  });
  siteGame.changeFieldControl('funPanelDefaultCategory', 'builtin', 'singleLine', {
    helpText: 'Name of the default category to be shown in the mini game lobby on the multi game layout',
  });
  siteGame.changeFieldControl('funPanelBackgroundImage', 'builtin', 'singleLine', {
    helpText: 'URL of the image used for the page background if the game is loaded in the multi game layout',
  });
  siteGame.changeFieldControl('supportsCommunityJackpot', 'builtin', 'boolean', {
    helpText: 'Does the game support the site wide community jackpot?',
  });
  siteGame.changeFieldControl('operatorBarDisabled', 'builtin', 'boolean', {
    helpText: 'Should the operator bar functionality be disabled?',
  });
  siteGame.changeFieldControl('chat', 'builtin', 'objectEditor', {
    helpText: 'Chat configuration',
  });
  siteGame.changeFieldControl('gameId', 'builtin', 'singleLine', {
    helpText: 'Unique ID used to load the game (only required for NetEnt vendor)',
  });
  siteGame.changeFieldControl('page', 'builtin', 'singleLine', {
    helpText: 'Unique ID used to load the game (only required for Evolution vendor)',
  });
  siteGame.changeFieldControl('softwareId', 'builtin', 'singleLine', {
    helpText: 'Unique ID used to load the game (only required for IGT vendor)',
  });
  siteGame.changeFieldControl('denomAmount', 'builtin', 'singleLine', {
    helpText: 'Smallest monetary denomination the game allows (only required for IGT vendor)',
  });

  const gameConfig = migration
    .createContentType('gameConfig')
    .name('Game Config')
    .description('')
    .displayField('entryTitle');
  gameConfig.createField('entryTitle').name('entryTitle').type('Symbol');
    gameConfig.createField('gameSkin').name('gameSkin').type('Array').items({
    type: 'Symbol',
    validations: [],
  });
  gameConfig.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  gameConfig.changeFieldControl('gameSkin', 'builtin', 'listInput', {
    helpText: 'Unique identifier for the game on all backend systems',
  });

  const game = migration.createContentType('game').name('Game').description('').displayField('entryTitle');
  game.createField('entryTitle').name('entryTitle').type('Symbol');
  game
    .createField('venture')
    .name('venture')
    .type('Link')
    .validations([
      {
        linkContentType: ['venture'],
      },
    ])
    .linkType('Entry');
  game
    .createField('gameConfig')
    .name('gameConfig')
    .type('Link')
    .validations([
      {
        linkContentType: ['gameConfig'],
      },
    ])
    .linkType('Entry');
  game
    .createField('gameInfo')
    .name('gameInfo')
    .type('Link')
    .localized(true)
    .validations([
      {
        linkContentType: ['gameInfo'],
      },
    ])
    .linkType('Entry');
  game.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  game.changeFieldControl('venture', 'builtin', 'entryLinkEditor');
  game.changeFieldControl('gameConfig', 'builtin', 'entryLinkEditor');
  game.changeFieldControl('gameInfo', 'builtin', 'entryLinkEditor');
}) as MigrationFunction;
