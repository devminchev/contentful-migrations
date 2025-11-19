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
    const igMarketingSection = migration
        .createContentType('igMarketingSection')
        .name('IG Marketing Section')
        .description('Section containing multiple banners (like a banner carousel')
        .displayField('entryTitle');

    // Define the fields based on the JSON definition
    const igMarketingSectionFields: { id: string, options: IFieldOptions }[] = [
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
        { id: 'classification', options: { name: 'Classification', type: 'Symbol', required: false, defaultValue: { [locale]: 'MarketingSection' }, validations: [{ in: ['MarketingSection'] }], disabled: true } },
        { id: 'banners', options: { name: 'Banners', type: 'Array', required: true, items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['igBanner'] }] } } },
        {
            id: 'viewAllAction',
            options: {
                name: 'View All Action',
                type: 'Link',
                linkType: 'Entry',
                validations: [{ linkContentType: ['igView'] }]
            }
        },
        {
            id: 'viewAllActionText',
            options: {
                name: 'View All Action Text',
                disabled: false,
                type: 'Symbol',
                required: false,
                defaultValue: { [locale]: 'Go to' },
                validations: []
            }
        },
        {
            id: 'viewAllType',
            options: {
                name: 'View All Type',
                type: 'Symbol',
                required: true,
                defaultValue: { [locale]: 'none' },
                validations: [{ in: ['view', 'none'] }]
            }
        },
        {
            id: 'displayType',
            options: {
                name: 'Display Type',
                type: 'Symbol',
                required: true,
                localized: false,
                validations: [{ in: ['full', 'split'] }],
                defaultValue: { [locale]: 'split' }
            }
        },
    ];

    // Create the fields
    igMarketingSectionFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igMarketingSection
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
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the IG Marketing Section entry' },
        { id: 'title', widget: 'singleLine', helpText: 'Localized title for the IG Marketing Section' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Select applicable environments' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Select platforms for visibility' },
        { id: 'sessionVisibility', widget: 'checkbox', helpText: 'Select sessions for visibility' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'Associated venture for the banner' },
        { id: 'classification', widget: 'singleLine', helpText: 'Classification (fixed to BannerSection)' },
        { id: 'banners', widget: 'entryLinksEditor', helpText: 'Banners included in this section' },
        {
            id: 'viewAllAction',
            widget: 'entryLinkEditor',
            helpText: 'View all action configuration'
        },
        {
            id: 'viewAllActionText',
            widget: 'singleLine',
            helpText: 'The text for the View All button'
        },
        {
            id: 'viewAllType',
            widget: 'dropdown',
            helpText: 'Type of view all action'
        },
        { id: 'displayType', widget: 'dropdown', helpText: 'Should one banner or two banners be shown on one carousel pane' },
    ];

    // Apply widget controls to each field
    fieldControls.forEach(({ id, widget, helpText }) => {
        igMarketingSection.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
    });

}) as MigrationFunction;
