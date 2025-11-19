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
    const igSuggestedGames = migration
        .createContentType('igSuggestedGames')
        .name('IG Suggested Games')
        .description("This model is for the default fallback games, when a user doesn't have ML recommendations for the personalized suggested games")
        .displayField('entryTitle');

    const igSuggestedGamesFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'Entry Title', type: 'Symbol' } },
        { id: 'venture', options: { name: 'Venture', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['venture'] }] } },
        { id: 'games', options: { name: 'Games', type: 'Array', required: true, items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['siteGameV2'] }] } } },
        { id: 'environmentVisibility', options: { name: 'Environment Visibility', type: 'Array', items: { type: 'Symbol', validations: [{ in: ['staging', 'production'] }] } } }
    ];

    igSuggestedGamesFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igSuggestedGames.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the suggested games entry' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'The venture associated with this entry' },
        { id: 'games', widget: 'entryLinksEditor', helpText: 'List of fallback games' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Select the applicable environments' }
    ];

    fieldControls.forEach(({ id, widget, helpText }) => {
        igSuggestedGames.changeFieldControl(
            id,
            'builtin',
            widget as BuiltinEditor,
            { helpText }
        );
    });
}) as MigrationFunction;
