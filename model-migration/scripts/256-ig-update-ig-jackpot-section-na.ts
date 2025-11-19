import { MigrationFunction } from 'contentful-migration';

const parseArgs = (args: string[], acceptedArgs: string[]) =>
    args.reduce((acc, curr, idx) => {
        if (acceptedArgs.includes(curr)) {
            acc[curr] = args[idx + 1];
        }
        return acc;
    }, {} as Record<string, string>);

const parsedArgs = parseArgs(process.argv.slice(2), ['-s', '-a', '-e']);
const spaceId = parsedArgs['-s'];
const locale = spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

// Conditional-Fields App ID
const HEADLESS_JACKPOT_ID = '3JHBVICyVgdwV7dqKuv3l';

export = ((migration) => {

    const view = migration.editContentType('igJackpotsSection');

    view.changeFieldControl(
        'headlessJackpot',
        'app',
        HEADLESS_JACKPOT_ID,
        {
            helpText: 'Headless jackpot ID',
            isRequired: false,
        }
    );

}) as MigrationFunction;

