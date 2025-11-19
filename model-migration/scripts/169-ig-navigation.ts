import { MigrationFunction, FieldType, IFieldOptions, BuiltinEditor } from 'contentful-migration';
const GAME_METADATA_PLATFORM_CONFIG_APP = '3WZ3tD2TDg6eqF7aK5jxG3';

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
    const igNavigation = migration
        .createContentType('igNavigation')
        .name('IG Navigation')
        .description('Typically defines your main or global site menu.')
        .displayField('entryTitle');

    const igNavigationFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'EntryTitle', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'venture', options: { name: 'Venture', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['venture'] }] } },
        { id: 'links', options: { 
            name: 'Links', 
            type: 'Array', 
            required: true, 
            items: { 
                type: 'Link', 
                linkType: 'Entry', 
                validations: [{ linkContentType: ['igLink'] }] 
            } 
        } },
        { id: 'bottomNavLinks', options: { 
            name: 'Bottom Nav Links', 
            type: 'Array', 
            required: false, 
            items: { 
                type: 'Link', 
                linkType: 'Entry', 
                validations: [{ linkContentType: ['igLink'] }] 
            } 
        } }
    ];

    igNavigationFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igNavigation.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.localized !== undefined) fieldInstance.localized(options.localized);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the navigation entry' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'The venture this navigation is associated with' },
        { id: 'links', widget: 'entryLinksEditor', helpText: 'List of navigation links (must be of type igLink)' },
        { id: 'links', widget: 'entryLinksEditor', helpText: 'List of navigation links (must be of type igLink) for the bottom nav on mobile' }
    ];

    fieldControls.forEach(({ id, widget, helpText }) => {
        igNavigation.changeFieldControl(
            id,
            'builtin',
            widget as BuiltinEditor,
            { helpText }
        );
    });
}) as MigrationFunction;

