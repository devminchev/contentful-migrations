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


    gameV2.createField('imgUrlPattern')
        .name('imgUrlPattern')
        .type('Symbol')
        .localized(false)
        .required(false)
        .disabled(false)
        .omitted(false)
        .validations([])

    gameV2.changeFieldControl('imgUrlPattern', 'builtin', 'singleLine', {
        helpText: 'URL pattern for images that will be displayed alongside the game information'
    });


}) as MigrationFunction;
