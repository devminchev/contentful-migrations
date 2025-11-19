import { MigrationFunction } from 'contentful-migration';

const parseArgs = (args: string[], acceptedArgs: string[]) => {
    return args.reduce((acc, curr, idx) => {
        if (acceptedArgs.includes(curr)) {
            acc[curr] = args[idx + 1];
        }
        return acc;
    }, {} as { [key: string]: string });
};

const parsedArgs = parseArgs(process.argv.slice(2), ['-s', '-a', '-e']);
const spaceId = parsedArgs['-s'];
const locale = spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

export = ((migration) => {
    const gameV2 = migration.editContentType('gameV2');

    // 1) Move entryTitle to the top
    gameV2.moveField('entryTitle').toTheTop();

    // 2) title just below entryTitle
    gameV2.moveField('title').afterField('entryTitle');

    // 3) launchCode below title
    gameV2.moveField('launchCode').afterField('title');

    // 4) gamePlatformConfig below launchCode
    gameV2.moveField('gamePlatformConfig').afterField('launchCode');

    // 5) maxBet below gamePlatformConfig
    gameV2.moveField('maxBet').afterField('gamePlatformConfig');

    // 6) minBet below maxBet
    gameV2.moveField('minBet').afterField('maxBet');

    // 7) howToPlayContent below minBet
    gameV2.moveField('howToPlayContent').afterField('minBet');

    // 8) infoDetails below howToPlayContent
    gameV2.moveField('infoDetails').afterField('howToPlayContent');

    // 9) introductionContent below infoDetails
    gameV2.moveField('introductionContent').afterField('infoDetails');

    // 10) platformVisibility below introductionContent
    gameV2.moveField('platformVisibility').afterField('introductionContent');

    // 11) progressiveJackpot below platformVisibility
    gameV2.moveField('progressiveJackpot').afterField('platformVisibility');

    // 12) tags below progressiveJackpot
    gameV2.moveField('tags').afterField('progressiveJackpot');

    // 13) vendor below tags
    gameV2.moveField('vendor').afterField('tags');

    // 14) showNetPosition below vendor
    gameV2.moveField('showNetPosition').afterField('vendor');

    // 15) representativeColor below showNetPosition
    gameV2.moveField('representativeColor').afterField('showNetPosition');

    // 16) progressiveBackgroundColor below representativeColor
    gameV2.moveField('progressiveBackgroundColor').afterField('representativeColor');

    // 17) rgpEnabled below progressiveBackgroundColor
    gameV2.moveField('rgpEnabled').afterField('progressiveBackgroundColor');

    // 18) showGameName below rgpEnabled
    gameV2.moveField('showGameName').afterField('rgpEnabled');

    // 19) webComponentData below showGameName
    gameV2.moveField('webComponentData').afterField('showGameName');

    // 20) dfgWeeklyImgUrlPattern below webComponentData
    gameV2.moveField('dfgWeeklyImgUrlPattern').afterField('webComponentData');

    // 21) bynderDFGWeeklyImage below dfgWeeklyImgUrlPattern
    gameV2.moveField('bynderDFGWeeklyImage').afterField('dfgWeeklyImgUrlPattern');

    // 22) infoImgUrlPattern below bynderDFGWeeklyImage
    gameV2.moveField('infoImgUrlPattern').afterField('bynderDFGWeeklyImage');

    // 23) bynderGameInfoGameTile below infoImgUrlPattern
    gameV2.moveField('bynderGameInfoGameTile').afterField('infoImgUrlPattern');

    // 24) imgUrlPattern below bynderGameInfoGameTile
    gameV2.moveField('imgUrlPattern').afterField('bynderGameInfoGameTile');

    // 25) bynderLoggedInGameTile below imgUrlPattern
    gameV2.moveField('bynderLoggedInGameTile').afterField('imgUrlPattern');

    // 26) loggedOutImgUrlPattern below bynderLoggedInGameTile
    gameV2.moveField('loggedOutImgUrlPattern').afterField('bynderLoggedInGameTile');

    // 27) bynderLoggedOutGameTile below loggedOutImgUrlPattern
    gameV2.moveField('bynderLoggedOutGameTile').afterField('loggedOutImgUrlPattern');

    // 28) videoUrlPattern below bynderLoggedOutGameTile
    gameV2.moveField('videoUrlPattern').afterField('bynderLoggedOutGameTile');

    // 29) bynderVideoGameTile below videoUrlPattern
    gameV2.moveField('bynderVideoGameTile').afterField('videoUrlPattern');

    // 30) funPanelBackgroundImage below bynderVideoGameTile
    gameV2.moveField('funPanelBackgroundImage').afterField('bynderVideoGameTile');

    // 31) bynderFunPanelBackgroundImage below funPanelBackgroundImage
    gameV2.moveField('bynderFunPanelBackgroundImage').afterField('funPanelBackgroundImage');

    // 32) funPanelDefaultCategory below bynderFunPanelBackgroundImage
    gameV2.moveField('funPanelDefaultCategory').afterField('bynderFunPanelBackgroundImage');

    // 33) funPanelEnabled below funPanelDefaultCategory
    gameV2.moveField('funPanelEnabled').afterField('funPanelDefaultCategory');

    // 34) operatorBarDisabled below funPanelEnabled
    gameV2.moveField('operatorBarDisabled').afterField('funPanelEnabled');

    // 35) animationMedia below operatorBarDisabled
    gameV2.moveField('animationMedia').afterField('operatorBarDisabled');

    // 36) loggedOutAnimationMedia below animationMedia
    gameV2.moveField('loggedOutAnimationMedia').afterField('animationMedia');

    // 37) foregroundLogoMedia below loggedOutAnimationMedia
    gameV2.moveField('foregroundLogoMedia').afterField('loggedOutAnimationMedia');

    // 38) loggedOutForegroundLogoMedia below foregroundLogoMedia
    gameV2.moveField('loggedOutForegroundLogoMedia').afterField('foregroundLogoMedia');

    // 39) backgroundMedia below loggedOutForegroundLogoMedia
    gameV2.moveField('backgroundMedia').afterField('loggedOutForegroundLogoMedia');

    // 40) loggedOutBackgroundMedia below backgroundMedia
    gameV2.moveField('loggedOutBackgroundMedia').afterField('backgroundMedia');

    // 42) nativeRequirement below meta
    gameV2.moveField('nativeRequirement').afterField('loggedOutBackgroundMedia');

    // 43) platform below nativeRequirement
    gameV2.moveField('platform').afterField('nativeRequirement');

    // 44) Make 'platform' not required anymore
    gameV2.editField('platform').required(false);

    // 45) Append deprecation notice to 'platform' help text
    gameV2.changeFieldControl('platform', 'builtin', 'tagEditor', {
        helpText: 'On which platforms this game will load. This field is deprecated. Use platformVisibility instead'
    });
}) as MigrationFunction;
