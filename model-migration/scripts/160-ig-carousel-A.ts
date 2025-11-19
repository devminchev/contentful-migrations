import { MigrationFunction, FieldType, IFieldOptions, BuiltinEditor } from 'contentful-migration';
import {  viewAllFields, viewAllFieldControls } from '../sharedFields';

// Reuse the same argument parsing logic and locale selection as in the template
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

export = (function (migration) {
    // 1) Create the content type
    const igCarouselA = migration
        .createContentType('igCarouselA')
        .name('IG Carousel A')
        .description('Our standard carousel, used for recently played.')
        .displayField('entryTitle');

    // 2) Define fields and their options
    const igCarouselAFields: { id: string; options: IFieldOptions }[] = [
        {
            id: 'entryTitle',
            options: {
                name: 'Entry Title',
                type: 'Symbol',
                required: true,
                validations: [{ unique: true }],
            },
        },
        {
            id: 'title',
            options: {
                name: 'Title',
                type: 'Symbol',
                localized: true,
                required: true,
                validations: []
            },
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
                defaultValue: { [locale]: ['staging'] },
                items: {
                    type: 'Symbol',
                    validations: [
                        {
                            in: ['staging', 'production'],
                        },
                    ],
                },
            },
        },
        {
            id: 'platformVisibility',
            options: {
                name: 'Platform Visibility',
                type: 'Array',
                required: true,
                defaultValue: { [locale]: ['web', 'ios', 'android'] },
                items: {
                    type: 'Symbol',
                    validations: [
                        {
                            in: ['ios', 'android', 'web'],
                        },
                    ],
                },
            },
        },
        {
            id: 'sessionVisibility',
            options: {
                name: 'Session Visibility',
                type: 'Array',
                required: true,
                defaultValue: { [locale]: ['loggedIn'] },
                items: {
                    type: 'Symbol',
                    validations: [
                        {
                            in: ['loggedOut', 'loggedIn'],
                        },
                    ],
                },
            },
        },
        {
            id: 'venture',
            options: {
                name: 'Venture',
                type: 'Link',
                linkType: 'Entry',
                required: true,
                validations: [
                    {
                        linkContentType: ['venture'],
                    },
                ],
            },
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
        {
            id: 'layoutType',
            options: {
                name: 'Layout Type',
                type: 'Symbol',
                required: false,
                defaultValue: { [locale]: 'carousel-a' },
                validations: [
                    {
                        in: ['carousel-a'],
                    },
                ],
                disabled: true,
            },
        },
        { id: 'classification', options: { name: 'Classification', type: 'Symbol', required: false, defaultValue: { [locale]: 'GameSection' }, validations: [{ in: ['GameSection'] }], disabled: true } },
        ...viewAllFields(locale)
    ];

    // 3) Create each field
    igCarouselAFields.forEach((field) => {
        const { id, options } = field;
        const fieldInstance = igCarouselA
            .createField(id)
            .name(options.name as string)
            .type(options.type as FieldType);

        if (options.required !== undefined) {
            fieldInstance.required(options.required);
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
        if (options.disabled !== undefined) {
            fieldInstance.disabled(options.disabled);
        }
        if (options.localized !== undefined) {
            fieldInstance.localized(options.localized);
        }
    });

    // 4) Set up field controls / widgets
    const fieldControls = [
        {
            id: 'entryTitle',
            widget: 'singleLine',
            helpText: 'The title of the IG Carousel A entry',
        },
        {
            id: 'title',
            widget: 'singleLine',
            helpText: 'Localized title for the IG Carousel A',
        },
        { id: 'slug', widget: 'singleLine', helpText: 'Unique slug identifying partial path to the view' },
        {
            id: 'environmentVisibility',
            widget: 'checkbox',
            helpText: 'Select environment(s) where this carousel is visible',
        },
        {
            id: 'platformVisibility',
            widget: 'checkbox',
            helpText: 'Platforms where this carousel is visible',
        },
        {
            id: 'sessionVisibility',
            widget: 'checkbox',
            helpText: 'Session states for which this carousel is visible',
        },
        {
            id: 'venture',
            widget: 'entryLinkEditor',
            helpText: 'The associated venture',
        },
        {
            id: 'games',
            widget: 'entryLinksEditor',
            helpText: 'Games included in this carousel',
        },
        {
            id: 'layoutType',
            widget: 'dropdown',
            helpText: 'Layout type (fixed to carousel-a)',
        },
        { id: 'classification', widget: 'singleLine', helpText: 'Layout type (fixed to GameSection)' },
        ...viewAllFieldControls
    ];

    fieldControls.forEach(({ id, widget, helpText }) => {
        igCarouselA.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
    });
}) as MigrationFunction;
