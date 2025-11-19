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
    const igBanner = migration.editContentType('igBanner');

    igBanner.createField('bannerType')
        .name('Banner Type')
        .type('Symbol')
        .localized(false)
        .required(false)
        .disabled(false)
        .omitted(false)
        .validations([
            { in: ['media', 'hero'] }
        ])
        .defaultValue({ [locale]: "media" })

    igBanner.changeFieldControl('bannerType', 'builtin', 'dropdown', {
        helpText: 'Select a banner type'
    });

}) as MigrationFunction;
