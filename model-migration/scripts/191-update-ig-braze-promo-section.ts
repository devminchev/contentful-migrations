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

export = ((migration) => {
    const igBrazePromoSection = migration.editContentType('igBrazePromosSection');

    igBrazePromoSection.createField('title')
        .name('Title')
        .type('Symbol')
        .localized(true)
        .required(false)
        .validations([]);

    igBrazePromoSection.changeFieldControl('title', 'builtin', 'singleLine', {
        helpText: 'Localised title for braze promotion section'
    });

}) as MigrationFunction;
