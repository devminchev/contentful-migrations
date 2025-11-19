import { MigrationFunction, FieldType, IFieldOptions, BuiltinEditor } from 'contentful-migration';
const BYNDER_APP_ID = '5KySdUzG7OWuCE2V3fgtIa';
const COLOR_PICKER_APP_ID = '4Vy3oAINwRgnxakoTz06tG';

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
// For the space nw2595tc1jdx we use en-GB (this ensures that default values match the JSON defaults)
const locale = spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

export = ((migration: any) => {

    // Create the content type
    const igBanner = migration
        .createContentType('igBanner')
        .name('IG Banner')
        .description('Banner')
        .displayField('entryTitle');

    // Define the fields based on the JSON definition
    const igBannerFields: { id: string, options: IFieldOptions }[] = [
        {
            id: 'entryTitle',
            options: {
                name: 'Entry Title',
                type: 'Symbol',
                required: true,
                localized: false,
                validations: [{ unique: true }]
            }
        },
        {
            id: 'title',
            options: {
                name: 'Title',
                type: 'Symbol',
                required: false,
                localized: true,
                validations: []
            }
        },
        {
            id: 'environmentVisibility',
            options: {
                name: 'Environment Visibility',
                type: 'Array',
                required: true,
                localized: false,
                validations: [],
                defaultValue: { [locale]: ['staging'] },
                items: {
                    type: 'Symbol',
                    validations: [{ in: ['staging', 'production'] }]
                }
            }
        },
        {
            id: 'platformVisibility',
            options: {
                name: 'Platform Visibility',
                type: 'Array',
                required: true,
                localized: false,
                validations: [],
                defaultValue: { [locale]: ['ios', 'android', 'web'] },
                items: {
                    type: 'Symbol',
                    validations: [{ in: ['ios', 'android', 'web'] }]
                }
            }
        },
        {
            id: 'sessionVisibility',
            options: {
                name: 'Session Visibility',
                type: 'Array',
                required: true,
                localized: false,
                validations: [],
                defaultValue: { [locale]: ['loggedIn'] },
                items: {
                    type: 'Symbol',
                    validations: [{ in: ['loggedOut', 'loggedIn'] }]
                }
            }
        },
        {
            id: 'venture',
            options: {
                name: 'Venture',
                type: 'Link',
                required: true,
                localized: false,
                validations: [{ linkContentType: ['venture'] }],
                linkType: 'Entry'
            }
        },
        { id: 'classification', options: { name: 'Classification', type: 'Symbol', required: false, defaultValue: { [locale]: 'BannerSection' }, validations: [{ in: ['BannerSection'] }], disabled: true } },
        {
            id: 'bynderMedia',
            options: {
                name: 'Bynder Media',
                type: 'Object',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'imageUrl',
            options: {
                name: 'Image URL',
                type: 'Symbol',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'videoUrl',
            options: {
                name: 'Video URL',
                type: 'Symbol',
                required: false,
                localized: false,
                validations: []
            }
        },
        { id: 'representativeColor', options: { name: 'Representative Color', type: 'Symbol', required: false } },
        {
            id: 'bannerLink',
            options: {
                name: 'Banner Link',
                type: 'Symbol',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'displaySize',
            options: {
                name: 'Display Size',
                type: 'Symbol',
                required: true,
                localized: false,
                validations: [{ in: ['small', 'medium', 'large'] }],
                defaultValue: { [locale]: 'medium' }
            }
        },
    ];

    // Create the fields
    igBannerFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igBanner
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

    // Define the field controls (widget configurations)
    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the IG Banner entry' },
        { id: 'title', widget: 'singleLine', helpText: 'Localized title for the IG Banner' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Select applicable environments' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Select platforms for visibility' },
        { id: 'sessionVisibility', widget: 'checkbox', helpText: 'Select sessions for visibility' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'Associated venture for the banner' },
        { id: 'classification', widget: 'singleLine', helpText: 'Layout type (fixed to BannerSection)' },
        { id: 'bynderMedia', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Manage Bynder Media content' },
        { id: 'imageUrl', widget: 'singleLine', helpText: 'Image URL for the banner' },
        { id: 'videoUrl', widget: 'singleLine', helpText: 'Video URL for the banner' },
        { id: 'representativeColor', widget: 'app', widgetId: COLOR_PICKER_APP_ID, helpText: 'Representative color for the banner' },
        { id: 'bannerLink', widget: 'singleLine', helpText: 'Banner link URL' },
        { id: 'displaySize', widget: 'dropdown', helpText: 'Size of the banner image' }
    ];

    // Apply widget controls to each field
    fieldControls.forEach(({ id, widget, widgetId, helpText }) => {
        if (widgetId) {
            igBanner.changeFieldControl(id, 'app', widgetId, { helpText });
        } else {
            igBanner.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
        }
    });

}) as MigrationFunction;
