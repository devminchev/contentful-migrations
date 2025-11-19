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
    const igQuickLinks = migration
        .createContentType('igQuickLinks')
        .name('IG Quick Links')
        .description('A collection of iGaming Experience (IG) Quick Links Section')
        .displayField('entryTitle');

    const igQuickLinksFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'Entry Title', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'layoutType', options: { name: 'Layout Type', type: 'Symbol', required: true, defaultValue: { [locale]: 'carousel-pill' }, validations: [{ in: ['carousel', 'grid', 'list', 'carousel-pill'] }] } },
        { id: 'links', options: { name: 'Links', type: 'Array', required: true, items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['igLink'] }] } } },
        { id: 'platformVisibility', options: { name: 'Platform Visibility', type: 'Array', required: true, items: { type: 'Symbol', validations: [{ in: ['web', 'android', 'ios'] }] }, defaultValue: { [locale]: [ 'web', 'ios', 'android'] } } },
        { id: 'environmentVisibility', options: { name: 'Environment Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['staging'] }, items: { type: 'Symbol', validations: [{ in: ['staging', 'production'] }] } } },
        { id: 'sessionVisibility', options: { name: 'Session Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['loggedIn'] }, items: { type: 'Symbol', validations: [{ in: ['loggedIn', 'loggedOut'] }] } } },
        { id: 'classification', options: { name: 'Classification', type: 'Symbol', required: false, defaultValue: { [locale]: 'QuickLinksSection' }, validations: [{ in: ['QuickLinksSection'] }], disabled: true } },
    ];

    igQuickLinksFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igQuickLinks.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
        if (options.disabled !== undefined) fieldInstance.disabled(options.disabled);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the IG Quick Links entry' },
        { id: 'layoutType', widget: 'dropdown', helpText: 'Select the layout style for the quick links' },
        { id: 'links', widget: 'entryLinksEditor', helpText: 'Add links to this quick links section' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Platforms where these quick links are visible' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Environments where these quick links are visible' },
        { id: 'sessionVisibility', widget: 'checkbox', helpText: 'Sessions where these quick links are applicable' },
        { id: 'classification', widget: 'singleLine', helpText: 'Layout type (fixed to QuickLinksSection)' },
    ];

    fieldControls.forEach(({ id, widget, helpText }) => {
        igQuickLinks.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
    });
}) as MigrationFunction;
