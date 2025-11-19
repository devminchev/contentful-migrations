import { MigrationFunction } from 'contentful-migration';

const BYNDER_APP_ID = '5KySdUzG7OWuCE2V3fgtIa';

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

    // launchCode
    // gameV2.createField('launchCode')
    //     .name('launchCode')
    //     .type('Symbol')
    //     .localized(false)
    //     .required(false);

    // funPanelBackgroundImage field
    gameV2.createField('bynderFunPanelBackgroundImage')
        .name('Bynder Fun Panel Background Image')
        .type('Object')
        .localized(true)
        .required(false);

    // bynderInfoImgUrlPattern field
    gameV2.createField('bynderGameInfoGameTile')
        .name('Bynder Game Info Game Tile')
        .type('Object')
        .localized(true)
        .required(false);

    // bynderLoggedOutImgUrlPattern field
    gameV2.createField('bynderLoggedOutGameTile')
        .name('Bynder Logged Out Game Tile')
        .type('Object')
        .localized(true)
        .required(false)
        .validations([]);

    // bynderImgUrlPattern field
    gameV2.createField('bynderLoggedInGameTile')
        .name('Bynder Logged In Game Tile')
        .type('Object')
        .localized(true)
        .required(false)
        .validations([]);

    // bynderDfgWeeklyImgUrlPattern field
    gameV2.createField('bynderDFGWeeklyImage')
        .name('Bynder DFG Weekly Image')
        .type('Object')
        .localized(true)
        .required(false)
        .validations([]);

    // bynderVideoUrlPattern field
    gameV2.createField('bynderVideoGameTile')
        .name('Bynder Video Game Tile')
        .type('Object')
        .localized(true)
        .required(false)
        .validations([]);

    // 2. Change the field controls for the created fields 
    gameV2.changeFieldControl(
        'bynderFunPanelBackgroundImage',
        'app',
        BYNDER_APP_ID,
        { helpText: 'Configure fun panel background image' }
    );

    gameV2.changeFieldControl(
        'bynderGameInfoGameTile',
        'app',
        BYNDER_APP_ID,
        { helpText: 'Configure info image' }
    );

    gameV2.changeFieldControl(
        'bynderLoggedOutGameTile',
        'app',
        BYNDER_APP_ID,
        { helpText: 'Configure logged out image' }
    );

    gameV2.changeFieldControl(
        'bynderLoggedInGameTile',
        'app',
        BYNDER_APP_ID,
        { helpText: 'Configure image pattern' }
    );

    gameV2.changeFieldControl(
        'bynderDFGWeeklyImage',
        'app',
        BYNDER_APP_ID,
        { helpText: 'Configure DFG weekly image pattern' }
    );

    gameV2.changeFieldControl(
        'bynderVideoGameTile',
        'app',
        BYNDER_APP_ID,
        { helpText: 'Configure video URL pattern' }
    );

    gameV2.moveField('launchCode').afterField('entryTitle');
    gameV2.moveField('bynderFunPanelBackgroundImage').afterField('funPanelBackgroundImage');
    gameV2.moveField('bynderGameInfoGameTile').afterField('infoImgUrlPattern');
    gameV2.moveField('bynderLoggedOutGameTile').afterField('loggedOutImgUrlPattern');
    gameV2.moveField('bynderLoggedInGameTile').afterField('imgUrlPattern');
    gameV2.moveField('bynderDFGWeeklyImage').afterField('dfgWeeklyImgUrlPattern');
    gameV2.moveField('bynderVideoGameTile').afterField('videoUrlPattern');

    gameV2.createField('platformVisibility')
        .name('Platform Visibility')
        .type('Array')
        .localized(false)
        .required(true)
        .disabled(false)
        .omitted(false)
        .items({
            type: 'Symbol',
            validations: [{
                in: ['web', 'ios', 'android']
            }]
        })
        .defaultValue({ [locale]: ['web', 'ios', 'android'] });

    gameV2.changeFieldControl(
        'platformVisibility',
        'builtin',
        'checkbox',
        {}
    );

    gameV2.editField('vendor')
        .name('vendor')
        .required(true)
        .validations([{
            in: [
                "gamesys",
                "roxor-rgp",
                "lynx",
                "engage",
                "netent",
                "evolution",
                "igt",
                "infinity",
                "whitehat"
            ]
        }]);

}) as MigrationFunction;
