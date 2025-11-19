import { MigrationFunction, FieldType, IFieldOptions, BuiltinEditor } from 'contentful-migration';
const GAME_METADATA_PLATFORM_CONFIG_APP = '3WZ3tD2TDg6eqF7aK5jxG3';
const BYNDER_APP_ID = '5KySdUzG7OWuCE2V3fgtIa';

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
    const igLink = migration
        .createContentType('igLink')
        .name('IG Link')
        .description('iGaming Experience (IG) Link item that can be managed and re-used across Navigation, IG Quick Links, Footer, etc.')
        .displayField('entryTitle');

    const igLinkFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'EntryTitle', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'label', options: { name: 'Label', type: 'Symbol', localized: true, required: true } },
        { id: 'platformVisibility', options: { name: 'Platform Visibility', type: 'Array', required: true, items: { type: 'Symbol', validations: [{ in: ['web', 'android', 'ios'] }] }, defaultValue: { [locale]: ['web', 'ios', 'android'] } } },
        { id: 'environmentVisibility', options: { name: 'Environment Visibility', type: 'Array', required: true, items: { type: 'Symbol', validations: [{ in: ['staging', 'production'] }] }, defaultValue: { [locale]: ['staging'] } } },
        { id: 'sessionVisibility', options: { name: 'Session Visibility', type: 'Array', required: true, items: { type: 'Symbol', validations: [{ in: ['loggedIn', 'loggedOut'] }] }, defaultValue: { [locale]: ['loggedIn'] } } },
        { id: 'view', options: { name: 'View', type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['igView'] }] } },
        { id: 'externalUrl', options: { name: 'External URL', type: 'Symbol' } },
        { id: 'internalUrl', options: { name: 'Internal URL', type: 'Symbol' } },
        { id: 'subMenu', options: { name: 'Sub Menu', type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['igLink'] }] } },
        { id: 'bynderImage', options: { name: 'Bynder Image', type: 'Object', localized: true, validations: [{ size: { max: 1 } }] } },
        { id: 'image', options: { name: 'Image', type: 'Text', localized: true } },
        {
            id: 'liveHidden',
            options: {
                name: 'liveHidden',
                type: 'Boolean',
                required: false,
                localized: false,
                omitted: false,
                defaultValue: { [locale]: false },
            }
        }
    ];

    igLinkFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igLink.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.localized !== undefined) fieldInstance.localized(options.localized);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the link entry' },
        { id: 'label', widget: 'singleLine', helpText: 'The label for the link' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Platforms where this link is available' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Environments where this link is available' },
        { id: 'sessionVisibility', widget: 'checkbox', helpText: 'Session visibility for this link' },
        { id: 'view', widget: 'entryLinkEditor', helpText: 'The view associated with this link' },
        { id: 'externalUrl', widget: 'singleLine', helpText: 'External URL for this link (if applicable)' },
        { id: 'internalUrl', widget: 'singleLine', helpText: 'Internal URL for this link (if applicable)' },
        { id: 'subMenu', widget: 'entryLinkEditor', helpText: 'Sub menu links (if any)' },
        { id: 'bynderImage', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Image from Bynder asset library' },
        { id: 'image', widget: 'singleLine', helpText: 'Image URL or description' },
        {
            id: 'liveHidden',
            widget: 'boolean',
            helpText: 'Indicates whether this item is hidden in live environment',
        }
    ];

    fieldControls.forEach(({ id, widget, widgetId, helpText }) => {
        if (widgetId) {
            igLink.changeFieldControl(id, 'app', widgetId, { helpText });
        } else {
            igLink.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
        }
    });
}) as MigrationFunction;

