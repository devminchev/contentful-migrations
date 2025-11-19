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

    // 1. Create the fields controls for the created fields
    gameV2.createField('animationMedia')
        .name('Logged In Animation Media')
        .type('Symbol')
        .localized(true)
        .required(false)
        .validations([
            {
                in: ['default', 'animated']
            }
        ]);

    gameV2.createField('loggedOutAnimationMedia')
        .name('Logged Out Animation Media')
        .type('Symbol')
        .localized(true)
        .required(false)
        .validations([
            {
                in: ['default', 'animated']
            }
        ]);

    gameV2.createField('foregroundLogoMedia')
        .name('Bynder Logged In Foreground Logo Media')
        .type('Object')
        .localized(true)
        .required(false)
        .validations([]);

    gameV2.createField('loggedOutForegroundLogoMedia')
        .name('Bynder Logged Out Foreground Logo Media')
        .type('Object')
        .localized(true)
        .required(false)
        .validations([]);

    gameV2.createField('backgroundMedia')
        .name('Bynder Logged In Background Media')
        .type('Object')
        .localized(true)
        .required(false)
        .validations([]);

    gameV2.createField('loggedOutBackgroundMedia')
        .name('Bynder Logged Out Background Media')
        .type('Object')
        .localized(true)
        .required(false)
        .validations([]);

    // 2. Change the field controls for the created fields 

    gameV2.changeFieldControl(
        'foregroundLogoMedia', 
        'app',
        BYNDER_APP_ID,
        { helpText: 'Configure foreground logo media' }
    );

    gameV2.changeFieldControl(
        'loggedOutForegroundLogoMedia', 
        'app',
        BYNDER_APP_ID,
        { helpText: 'Configure logged out foreground logo media' }
    );

    gameV2.changeFieldControl(
        'backgroundMedia', 
        'app',
        BYNDER_APP_ID,
        { helpText: 'Configure background media' }
    );

    gameV2.changeFieldControl(
        'loggedOutBackgroundMedia', 
        'app',
        BYNDER_APP_ID,
        { helpText: 'Configure logged out background media' }
    );

}) as MigrationFunction;
