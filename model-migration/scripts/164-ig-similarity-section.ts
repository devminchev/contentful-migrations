import { MigrationFunction, FieldType, IFieldOptions, BuiltinEditor } from 'contentful-migration';
import {  viewAllFields, viewAllFieldControls } from '../sharedFields';

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
    const igSimilarityBasedPersonalisedSection = migration
        .createContentType('igSimilarityBasedPersonalisedSection')
        .name('IG Similarity Based Personalised Section')
        .description('For Similarity Based Suggestions coming from ML')
        .displayField('entryTitle');

    const igSimilarityBasedPersonalisedSectionFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'Entry Title', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'title', options: { name: 'Title', type: 'Symbol', required: true, defaultValue: { [locale]: 'Suggested For You' } } },
        { id: 'slug', options: { name: 'Slug', type: 'Symbol', required: true,
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
        { id: 'venture', options: { name: 'Venture', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['venture'] }] } },
        { id: 'platformVisibility', options: { name: 'Platform Visibility', type: 'Array', required: true, items: { type: 'Symbol', validations: [{ in: ['web', 'ios', 'android'] }] }, defaultValue: { [locale]: ['web', 'ios', 'android'] } } },
        { id: 'environmentVisibility', options: { name: 'Environment Visibility', type: 'Array', required: true, items: { type: 'Symbol', validations: [{ in: ['staging', 'production'] }] }, defaultValue: { [locale]: ['staging'] } } },
        { id: 'sessionVisibility', options: { name: 'Session Visibility', type: 'Array', required: true, items: { type: 'Symbol', validations: [{ in: ['loggedIn'] }] }, defaultValue: { [locale]: ['loggedIn'] } } },
        { id: 'layoutType', options: { name: 'Layout Type', type: 'Symbol', required: false, defaultValue: { [locale]: 'carousel-a' }, validations: [{ in: ['carousel-a'] }], disabled: true } },
        { id: 'type', options: { name: 'Type', type: 'Symbol', required: true, validations: [{ in: ['recently-played', 'because-you-played-x', 'because-you-played-y', 'on-exit-recommendations', 'because-you-played-z' ] }], defaultValue: { [locale]: 'because-you-played-x' } } },
        { id: 'classification', options: { name: 'Classification', type: 'Symbol', required: false, defaultValue: { [locale]: 'PersonalisedSection' }, validations: [{ in: ['PersonalisedSection'] }], disabled: true } },
        ...viewAllFields(locale)
    ];

    igSimilarityBasedPersonalisedSectionFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igSimilarityBasedPersonalisedSection.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.localized !== undefined) fieldInstance.localized(options.localized);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
        if (options.disabled !== undefined) fieldInstance.disabled(options.disabled);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the section' },
        { id: 'title', widget: 'singleLine', helpText: 'The displayed title of the section' },
        { id: 'slug', widget: 'singleLine', helpText: 'Unique slug identifying partial path to the view' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'The venture associated with this section' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Platforms where this section is visible' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Environments where this section is available' },
        { id: 'sessionVisibility', widget: 'checkbox', helpText: '' },
        { id: 'type', widget: 'dropdown', helpText: 'Type of similarity-based recommendations' },
        { id: 'layoutType', widget: 'singleLine', helpText: 'Layout type for displaying recommendations' },
        { id: 'classification', widget: 'singleLine', helpText: 'Layout type (fixed to PersonalisedSection)' },
        ...viewAllFieldControls
    ];

    fieldControls.forEach(({ id, widget, helpText }) => {
        igSimilarityBasedPersonalisedSection.changeFieldControl(
            id,
            'builtin',
            widget as BuiltinEditor,
            { helpText }
        );
    });
}) as MigrationFunction;

 