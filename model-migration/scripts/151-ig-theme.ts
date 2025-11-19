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
const locale = spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

export = ((migration) => {
    const igTheme = migration
        .createContentType('igTheme')
        .name('IG Theme')
        .description('The iGaming Experience Theme which has the options to use an Image, Colour that will be used in the IG')
        .displayField('entryTitle');

    const igThemeFields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'EntryTitle', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'image', options: { name: 'Image', type: 'Object', validations: [{ size: { max: 1 } }] } },
        { id: 'primaryColor', options: { name: 'Primary Color', type: 'Symbol', required: true } },
        { id: 'secondaryColor', options: { name: 'Secondary Color', type: 'Symbol' } },
        { id: 'venture', options: { name: 'Venture', type: 'Link', linkType: 'Entry', required: true, validations: [{ linkContentType: ['venture'] }] } }
    ];

    igThemeFields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = igTheme.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
    });

    const fieldControls = [
        { id: 'entryTitle', widget: 'singleLine', helpText: 'The title of the theme entry' },
        { id: 'image', widget: 'app', helpText: 'Upload an image for the theme' },
        { id: 'primaryColor', widget: 'app', helpText: 'Primary color of the theme' },
        { id: 'secondaryColor', widget: 'app', helpText: 'Secondary color of the theme' },
        { id: 'venture', widget: 'entryLinkEditor', helpText: 'The venture associated with this theme' }
    ];

    fieldControls.forEach(({ id, widget, helpText }) => {
        if (id === 'image') {
            igTheme.changeFieldControl('image', 'app', BYNDER_APP_ID, { helpText });
        } else if (id === 'primaryColor' || id === 'secondaryColor') {
            igTheme.changeFieldControl(id, 'app', COLOR_PICKER_APP_ID, { helpText });
        } else {
            igTheme.changeFieldControl(
                id,
                'builtin',
                widget as BuiltinEditor,
                { helpText }
            );
        }
    });


}) as MigrationFunction;
