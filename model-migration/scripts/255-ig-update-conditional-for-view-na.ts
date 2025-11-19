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
const CONDITIONAL_FIELDS_APP_ID = '3OauNEp5rijvC1ZzdaHvdo';

export = ((migration) => {

    const view = migration.editContentType('igView');

    view.changeFieldControl(
        'viewSlug',
        'app',
        CONDITIONAL_FIELDS_APP_ID,
        {
            helpText: 'Unique slug identifying partial path to the view',
            isRequired: true,
            isUniquePerVenture: true,
            isUniqueReferenceList: false
        }
    );

}) as MigrationFunction;

