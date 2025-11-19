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
    const igView = migration
        .createContentType('igView')
        .name('IG View')
        .description('A collection of iGaming Experience (IG) View sections')
        .displayField('entryTitle');

    const igViewFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'Entry Title', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'name', options: { name: 'Name', type: 'Symbol', required: true, localized: true, validations: [] } },
        {
            id: 'viewSlug', options: {
                name: 'View Slug', type: 'Symbol', required: true,
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
        { id: 'platformVisibility', options: { name: 'Platform Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['web', 'ios', 'android'] }, items: { type: 'Symbol', validations: [{ in: ['web', 'ios', 'android'] }] } } },
        { id: 'sessionVisibility', options: { name: 'Session Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['loggedIn'] }, items: { type: 'Symbol', validations: [{ in: ['loggedOut', 'loggedIn'] }] } } },
        { id: 'environmentVisibility', options: { name: 'Environment Visibility', type: 'Array', required: true, defaultValue: { [locale]: ['staging'] }, items: { type: 'Symbol', validations: [{ in: ['staging', 'production'] }] } } },
        { id: 'venture', options: { name: 'Venture', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['venture'] }] } },
        { id: 'topContent', options: { name: 'Top Content', type: 'Array', items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['igCollabBasedPersonalisedSection', 'igQuickLinks', 'igCarouselA', 'igBanner', 'igSimilarityBasedPersonalisedSection', 'igBrazePromosSection', 'igMarketingSection', 'igPromotionsGrid'] }] } } },
        { id: 'primaryContent', options: { name: 'Primary Content', type: 'Array', required: true, items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['igCollabBasedPersonalisedSection', 'igQuickLinks', 'igGridASection', 'igGridBSection', 'igGridCSection', 'igCarouselA', 'igCarouselB', 'igDfgSection', 'igGridDSection', 'igGridESection', 'igGridFSection', 'igGridGSection', 'igJackpotsSection', 'igBanner', 'igSimilarityBasedPersonalisedSection', 'igSearchResults', 'igBrazePromosSection', 'igJackpotSectionsBlock', 'igMarketingSection', 'igPromotionsGrid', 'igGameShuffle'] }] } } },
        { id: 'theme', options: { name: 'Theme', type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['igTheme'] }] } },
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
        },
        { id: 'classification', options: { name: 'Classification', type: 'Symbol', required: false, defaultValue: { [locale]: 'general' }, validations: [{ in: ['general', 'search'] }] } },
    ];

    igViewFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igView.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
        if (options.localized !== undefined) fieldInstance.localized(options.localized);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the IG View entry' },
        { id: 'name', widget: 'singleLine', helpText: 'Unique name for the IG View entry' },
        { id: 'viewSlug', widget: 'singleLine', helpText: 'Unique slug identifying partial path to the view' },
        { id: 'platformVisibility', widget: 'checkbox', helpText: 'Platforms where this IG View is visible' },
        { id: 'sessionVisibility', widget: 'checkbox', helpText: 'Sessions where this IG View is applicable' },
        { id: 'environmentVisibility', widget: 'checkbox', helpText: 'Select applicable environments' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'The associated venture' },
        { id: 'topContent', widget: 'entryLinksEditor', helpText: 'Top content elements' },
        { id: 'primaryContent', widget: 'entryLinksEditor', helpText: 'Primary content elements' },
        { id: 'theme', widget: 'entryLinkEditor', helpText: 'Theme for this IG View' },
        {
            id: 'liveHidden',
            widget: 'boolean',
            helpText: 'Indicates whether this item is hidden in live environment',
        },
        { id: 'classification', widget: 'dropdown', helpText: 'Type of the view (default for normal lobby views)' }

    ];

    fieldControls.forEach(({ id, widget, helpText }) => {
        igView.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
    });
}) as MigrationFunction;
