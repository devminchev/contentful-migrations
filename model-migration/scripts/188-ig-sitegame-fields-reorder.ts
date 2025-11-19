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
    const siteGameV2 = migration.editContentType('siteGameV2');

    // 44) Make 'platform' not required anymore
    siteGameV2.editField('environment').required(false);

    // 45) Append deprecation notice to 'environment' help text
    siteGameV2.changeFieldControl('environment', 'builtin', 'checkbox', {
        helpText: 'The environment(s) where the game is active. This field is deprecated. Use environmentVisibility instead'
    });
}) as MigrationFunction;
