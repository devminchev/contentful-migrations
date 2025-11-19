import { MigrationFunction, FieldType, IFieldOptions, BuiltinEditor } from 'contentful-migration';

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
    const igDfgSection = migration
        .createContentType('igDfgSection')
        .name('IG DFG Section')
        .description('The new interactive DFG widget')
        .displayField('entryTitle');

    const igDfgFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'Entry Title', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'title', options: { name: 'Title', type: 'Symbol', localized: true, required: true, validations: [] } },
        { id: 'environmentVisibility', options: { name: 'Environment Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['staging'] }, items: { type: 'Symbol', validations: [{ in: ['staging', 'production'] }] } } },
        { id: 'platformVisibility', options: { name: 'Platform Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['ios', 'android', 'web'] }, items: { type: 'Symbol', validations: [{ in: ['ios', 'android', 'web'] }] } } },
        { id: 'sessionVisibility', options: { name: 'Session Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['loggedIn'] }, items: { type: 'Symbol', validations: [{ in: ['loggedOut', 'loggedIn'] }] } } },
        { id: 'venture', options: { name: 'Venture', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['venture'] }] } },
        { id: 'media', options: { name: 'Media', type: 'Symbol', required: false } },
        { id: 'dynamicBackground', options: { name: 'Dynamic Background', type: 'Symbol', required: false } },
        { id: 'dynamicLogo', options: { name: 'Dynamic Logo', type: 'Symbol', required: false } },
        { id: 'bynderMedia', options: { name: 'Bynder Media', type: 'Object', required: false } },
        { id: 'bynderDynamicBackground', options: { name: 'Bynder Dynamic Background', type: 'Object', required: false } },
        { id: 'bynderDynamicLogo', options: { name: 'Bynder Dynamic Logo', type: 'Object', required: false } },
        { id: 'link', options: { name: 'Link', type: 'Symbol', required: false } },
        { id: 'games', options: { name: 'Games', type: 'Array', required: true, items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['siteGameV2'] }] } } },
        { id: 'classification', options: { name: 'Classification', type: 'Symbol', required: false, defaultValue: { [locale]: 'DFGSection' }, validations: [{ in: ['DFGSection'] }], disabled: true } },
    ];

    igDfgFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igDfgSection.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
        if (options.localized !== undefined) fieldInstance.localized(options.localized);
        if (options.disabled !== undefined) fieldInstance.disabled(options.disabled);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the IG DFG Section entry' },
        { id: 'title', widget: 'singleLine', helpText: 'Localized title for the IG DFG Section' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Select applicable environments' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Platforms where this IG DFG Section is visible' },
        { id: 'sessionVisibility', widget: 'checkbox', helpText: 'Sessions where this IG DFG Section is applicable' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'The associated venture' },
        { id: 'media', widget: 'singleLine', helpText: 'The media for the IG DFG Section' },
        { id: 'dynamicBackground', widget: 'singleLine', helpText: 'The media for the IG DFG Section' },
        { id: 'dynamicLogo', widget: 'singleLine', helpText: 'The media for the IG DFG Section' },
        { id: 'bynderMedia', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Bydner Media for the IG DFG Section' },
        { id: 'bynderDynamicBackground', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Bydner Media for the IG DFG Section' },
        { id: 'bynderDynamicLogo', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Bydner Media for the IG DFG Section' },
        { id: 'link', widget: 'singleLine', helpText: 'A link for the media' },
        { id: 'games', widget: 'entryLinksEditor', helpText: 'Games included in this section' },
        { id: 'classification', widget: 'singleLine', helpText: 'Layout type (fixed to DFGSection)' },

    ];

    fieldControls.forEach(({ id, widget, widgetId, helpText }) => {
        if (widgetId) {
            igDfgSection.changeFieldControl(id, 'app', widgetId, { helpText });
        } else {
            igDfgSection.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
        }
    });
}) as MigrationFunction;
