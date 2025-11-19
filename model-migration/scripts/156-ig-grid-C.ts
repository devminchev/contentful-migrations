import { MigrationFunction, FieldType, IFieldOptions, BuiltinEditor } from 'contentful-migration';
import { viewAllFields, viewAllFieldControls } from '../sharedFields';

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
    const igGridCSection = migration
        .createContentType('igGridCSection')
        .name('IG Grid C Section')
        .description('')
        .displayField('entryTitle');

    const igGridCFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'Entry Title', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'title', options: { name: 'Title', type: 'Symbol', localized: true, required: true, validations: [] } },
        {
            id: 'slug', options: {
                name: 'Slug', type: 'Symbol', required: true,
                "validations": [
                    {
                        "size": {
                            "min": 2,
                            "max": 60
                        }
                    },
                    {
                        "regexp": {
                            "pattern": "^[a-z0-9][a-z0-9-]*$",
                            "flags": "s"
                        },
                        "message": "Section slug allows only lowercase words joined by dashes (-)"
                    }
                ]
            }
        },
        { id: 'environmentVisibility', options: { name: 'Environment Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['staging'] }, items: { type: 'Symbol', validations: [{ in: ['staging', 'production'] }] } } },
        { id: 'platformVisibility', options: { name: 'Platform Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['ios', 'android', 'web'] }, items: { type: 'Symbol', validations: [{ in: ['ios', 'android', 'web'] }] } } },
        { id: 'sessionVisibility', options: { name: 'Session Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['loggedIn'] }, items: { type: 'Symbol', validations: [{ in: ['loggedOut', 'loggedIn'] }] } } },
        { id: 'venture', options: { name: 'Venture', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['venture'] }] } },
        { id: 'game', options: { name: 'Game', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['siteGameV2'] }] } },
        { id: 'mediaLoggedIn', options: { name: 'Media Logged In', type: 'Object' } },
        { id: 'mediaLoggedOut', options: { name: 'Media Logged Out', type: 'Object' } },
        { id: 'image', options: { name: 'Image', type: 'Symbol' } },
        { id: 'layoutType', options: { name: 'Layout Type', type: 'Symbol', required: false, defaultValue: { [locale]: 'grid-c' }, validations: [{ in: ['grid-c'] }], disabled: true } },
        { id: 'classification', options: { name: 'Classification', type: 'Symbol', required: false, defaultValue: { [locale]: 'GameSection' }, validations: [{ in: ['GameSection'] }], disabled: true } },
        ...viewAllFields(locale)

    ];

    igGridCFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igGridCSection.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
        if (options.disabled !== undefined) fieldInstance.disabled(options.disabled);
        if (options.localized !== undefined) fieldInstance.localized(options.localized);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the IG Grid C Section entry' },
        { id: 'title', widget: 'singleLine', helpText: 'Localized title for the IG Grid C Section' },
        { id: 'slug', widget: 'singleLine', helpText: 'Unique slug identifying partial path to the view' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Select applicable environments' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Platforms where this IG Grid C Section is visible' },
        { id: 'sessionVisibility', widget: 'checkbox', helpText: 'Sessions where this IG Grid C Section is applicable' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'The associated venture' },
        { id: 'game', widget: 'entryLinkEditor', helpText: 'Game included in this section' },
        { id: 'mediaLoggedIn', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Image or Video displayed for logged-in users' },
        { id: 'mediaLoggedOut', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Image or Video displayed for logged-out users' },
        { id: 'image', widget: 'singleLine', helpText: 'legacy image url' },
        { id: 'layoutType', widget: 'dropdown', helpText: 'Layout type (fixed to grid-c)' },
        { id: 'classification', widget: 'singleLine', helpText: 'Layout type (fixed to GameSection)' },
        ...viewAllFieldControls
    ];

    fieldControls.forEach(({ id, widget, widgetId, helpText }) => {
        if (widgetId) {
            igGridCSection.changeFieldControl(id, 'app', widgetId, { helpText });
        } else {
            igGridCSection.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
        }
    });
}) as MigrationFunction;
