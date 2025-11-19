import { MigrationFunction, BuiltinEditor } from 'contentful-migration';

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

const SORT_OPTIONS = ['none', 'margin', 'rtp', 'wagered_amount', 'rounds_played'];

export = ((migration) => {
    const igSimilarityBasedPersonalisedSection = migration.editContentType('igSimilarityBasedPersonalisedSection');

    igSimilarityBasedPersonalisedSection.createField('sort')
        .name('Sort By')
        .type('Symbol')
        .required(false)
        .localized(false)
        .validations([
            { in: SORT_OPTIONS }
        ])
        .defaultValue({ [locale]: 'none' });

    igSimilarityBasedPersonalisedSection.changeFieldControl(
        'sort',
        'builtin',
        'dropdown' as BuiltinEditor,
        { helpText: 'Select the sort strategy for recently played games' }
    );
}) as MigrationFunction;
