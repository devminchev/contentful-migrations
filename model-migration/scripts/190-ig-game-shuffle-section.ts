import { MigrationFunction, FieldType, IFieldOptions, BuiltinEditor } from 'contentful-migration';

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
    const igGameShuffle = migration
        .createContentType('igGameShuffle')
        .name('IG Game Shuffle')
        .description('The iGaming Game Shuffle Section')
        .displayField('entryTitle');

    const igGameShuffleFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'Entry Title', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'title', options: { name: 'Title', type: 'Symbol', localized: true, required: true, validations: [] } },
        { id: 'name', options: { name: 'Name', type: 'Symbol', localized: true, required: true, validations: [] } },
        { id: 'classification', options: { name: 'Classification', type: 'Symbol', required: false, defaultValue: { [locale]: 'GameShuffleSection' }, validations: [{ in: ['GameShuffleSection'] }], disabled: true } },
        { id: 'environmentVisibility', options: { name: 'Environment Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['staging'] }, items: { type: 'Symbol', validations: [{ in: ['staging', 'production'] }] } } },
        { id: 'platformVisibility', options: { name: 'Platform Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['ios', 'android', 'web'] }, items: { type: 'Symbol', validations: [{ in: ['ios', 'android', 'web'] }] } } },
        { id: 'sessionVisibility', options: { name: 'Session Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['loggedIn'] }, items: { type: 'Symbol', validations: [{ in: ['loggedOut', 'loggedIn'] }] } } },
        { id: 'venture', options: { name: 'Venture', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['venture'] }] } },
    ];

    igGameShuffleFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igGameShuffle
            .createField(id)
            .name(options.name as string)
            .type(options.type as FieldType);
        if (options.required !== undefined) {
            fieldInstance.required(options.required);
        }
        if (options.localized !== undefined) {
            fieldInstance.localized(options.localized);
        }
        if (options.validations !== undefined) {
            fieldInstance.validations(options.validations);
        }
        if (options.defaultValue !== undefined) {
            fieldInstance.defaultValue(options.defaultValue);
        }
        if (options.items !== undefined) {
            fieldInstance.items(options.items as IFieldOptions);
        }
        if (options.linkType !== undefined) {
            fieldInstance.linkType(options.linkType);
        }
        if (options.disabled !== undefined) fieldInstance.disabled(options.disabled);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the IG Game Shuffle entry' },
        { id: 'title', widget: 'singleLine', helpText: 'Localized title for the IG Game Shuffle' },
        { id: 'name', widget: 'singleLine', helpText: 'Localized name for the IG Game Shuffle ' },
        { id: 'classification', widget: 'singleLine', helpText: 'Layout type (fixed to GameShuffleSection)' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Select applicable environments' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Select platforms for visibility' },
        { id: 'sessionVisibility', widget: 'checkbox', helpText: 'Select sessions for visibility' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'Associated venture for the IG Game Shuffle' },

    ];


    fieldControls.forEach(({ id, widget, helpText }) => {
        igGameShuffle.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
    });

}) as MigrationFunction;
