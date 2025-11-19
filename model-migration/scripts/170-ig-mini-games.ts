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
    const igMiniGames = migration
        .createContentType('igMiniGames')
        .name('IG Mini Games')
        .description('')
        .displayField('entryTitle');

    const igMiniGamesFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'EntryTitle', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'venture', options: { name: 'venture', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['venture'] }] } },
        { id: 'sections', options: { name: 'sections', type: 'Array', required: true, items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['igCarouselA'] }] } } },
        { id: 'platformVisibility', options: { name: 'Platform Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['ios', 'android', 'web'] }, items: { type: 'Symbol', validations: [{ in: ['web', 'android', 'ios'] }] } } },
        { id: 'environmentVisibility', options: { name: 'Environment Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['staging'] }, items: { type: 'Symbol', validations: [{ in: ['staging', 'production'] }] } } }
    ];

    igMiniGamesFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igMiniGames.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the IG Mini Games entry' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'The associated venture' },
        { id: 'sections', widget: 'entryLinksEditor', helpText: 'Sections included in this IG Mini Games' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Platforms where these IG Mini Games are visible' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Environments where these IG Mini Games are visible' }
    ];

    fieldControls.forEach(({ id, widget, helpText }) => {
        igMiniGames.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
    });
}) as MigrationFunction;
