import { MigrationFunction, FieldType, IFieldOptions, BuiltinEditor } from 'contentful-migration';
import { viewAllFields, viewAllFieldControls, FieldControl } from '../sharedFields';

const BYNDER_APP_ID = '5KySdUzG7OWuCE2V3fgtIa';
const HEADLESS_JACKPOT_ID = '5IBMS3lmcslXr9OPXHDZtR';

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
const JACKPOT_TYPES = [
    'blueprint-jackpots',
    'red-tiger-jackpots',
    'headless-jackpots',
    'whitehat-jackpots',
]

export = ((migration: any) => {

    // Create the content type
    const igJackpotsSection = migration
        .createContentType('igJackpotsSection')
        .name('IG Jackpots Section')
        .description('')
        .displayField('entryTitle');

    // Define the fields based on the JSON definition
    const igJackpotsSectionFields: { id: string, options: IFieldOptions }[] = [
        {
            id: 'entryTitle',
            options: {
                name: 'Entry Title',
                type: 'Symbol',
                required: true,
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
            id: 'jackpotType',
            options: {
                name: 'Jackpot Type',
                type: 'Symbol',
                required: true,
                localized: false,
                validations: [{ in: JACKPOT_TYPES }],
                defaultValue: { [locale]: 'generic' }
            }
        },
        {
            "id": "headlessJackpot",
            options: {
                "name": "headlessJackpot",
                "type": "Object",
                "localized": false,
                "required": false,
                "validations": [],
                "disabled": false,
                "omitted": false
            }
        },
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
                defaultValue: { [locale]: ['web', 'ios', 'android'] },
                items: {
                    type: 'Symbol',
                    validations: [{ in: ['web', 'ios', 'android'] }]
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
        { id: 'classification', options: { name: 'Classification', type: 'Symbol', required: false, defaultValue: { [locale]: 'JackpotSection' }, validations: [{ in: ['JackpotSection'] }], disabled: true } },
        {
            id: 'headerImageBynder',
            options: {
                name: 'Header Bynder Image',
                type: 'Object',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'backgroundImageBynder',
            options: {
                name: 'Background Bynder Image',
                type: 'Object',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'pot1ImageBynder',
            options: {
                name: 'Pot1 Bynder Image',
                type: 'Object',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'pot2ImageBynder',
            options: {
                name: 'Pot2 Bynder Image',
                type: 'Object',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'pot3ImageBynder',
            options: {
                name: 'Pot3 Bynder Image',
                type: 'Object',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'headerImage',
            options: {
                name: 'Header Image',
                type: 'Symbol',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'backgroundImage',
            options: {
                name: 'Background Image',
                type: 'Symbol',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'pot1Image',
            options: {
                name: 'Pot1 Image',
                type: 'Symbol',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'pot2Image',
            options: {
                name: 'Pot2 Image',
                type: 'Symbol',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'pot3Image',
            options: {
                name: 'Pot3 Image',
                type: 'Symbol',
                required: false,
                localized: false,
                validations: []
            }
        },
        {
            id: 'games',
            options: {
                name: 'Games',
                type: 'Array',
                required: true,
                items: {
                    type: 'Link',
                    linkType: 'Entry',
                    validations: [
                        {
                            linkContentType: ['siteGameV2'],
                        },
                    ],
                },
            },
        },
        ...viewAllFields(locale, {
            expandedSectionLayoutType: {
                // Overridden default value for this specific migration
                defaultValue: { [locale]: 'grid-a-expanded-jackpot' },
                validations: [{ in: ['grid-a-expanded-jackpot', 'grid-e-expanded-jackpot'] }]
            }
        })
    ];

    // Create the fields
    igJackpotsSectionFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igJackpotsSection
            .createField(id)
            .name(options.name as string)
            .type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.localized !== undefined) fieldInstance.localized(options.localized);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
        if (options.disabled !== undefined) fieldInstance.disabled(options.disabled);
    });

    // Define the field controls (the widget configurations)
    const fieldControls: FieldControl[] = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the IG Jackpots Section entry' },
        { id: 'title', widget: 'singleLine', helpText: 'Localized title for the IG Jackpots Section' },
        { id: 'jackpotType', widget: 'dropdown', helpText: 'Select a jackpot type' },
        { id: 'slug', widget: 'singleLine', helpText: 'Unique slug identifying partial path to the view' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Select applicable environments' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Select platforms for visibility' },
        { id: 'sessionVisibility', widget: 'checkbox', helpText: 'Select sessions for visibility' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'Associated venture for the jackpot section' },
        { id: 'classification', widget: 'singleLine', helpText: 'Layout type (fixed to JackpotSection)' },
        { id: 'headerImageBynder', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Configure the header image' },
        { id: 'backgroundImageBynder', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Set up the background image' },
        { id: 'pot1ImageBynder', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Configure pot1 image' },
        { id: 'pot2ImageBynder', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Configure pot2 image' },
        { id: 'pot3ImageBynder', widget: 'app', widgetId: BYNDER_APP_ID, helpText: 'Configure pot3 image' },
        { id: 'headerImage', widget: 'singleLine', helpText: 'Configure the header image' },
        { id: 'backgroundImage', widget: 'singleLine', helpText: 'Set up the background image' },
        { id: 'pot1Image', widget: 'singleLine', helpText: 'Configure pot1 image' },
        { id: 'pot2Image', widget: 'singleLine', helpText: 'Configure pot2 image' },
        { id: 'pot3Image', widget: 'singleLine', helpText: 'Configure pot3 image' },
        { id: 'games', widget: 'entryLinksEditor', helpText: 'Associated games for this jackpot section' },
        { id: 'headlessJackpot', widget: 'app', widgetId: HEADLESS_JACKPOT_ID, helpText: 'Headless jackpot ID' },
        ...viewAllFieldControls
    ];

    // Apply the widget control for each field
    fieldControls.forEach(({ id, widget, widgetId, helpText }) => {
        if (widgetId) {
            igJackpotsSection.changeFieldControl(id, 'app', widgetId, { helpText });
        } else {
            igJackpotsSection.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
        }
    });
}) as MigrationFunction;
