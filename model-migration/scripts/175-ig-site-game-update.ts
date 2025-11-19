import { MigrationFunction } from 'contentful-migration';

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
    const siteGameV2 = migration.editContentType('siteGameV2');

    // Add the new liveHidden field
    siteGameV2.createField('liveHidden')
        .name('liveHidden')
        .type('Boolean')
        .localized(false)
        .required(false)
        .disabled(false)
        .omitted(false)
        .defaultValue({ [locale]: false });

    // Add the new environmentVisibility field
        siteGameV2.createField('environmentVisibility')
        .name('Environment Visibility')
        .type('Array')
        .localized(false)
        .required(true)
        .disabled(false)
        .omitted(false)
        .items({
            type: 'Symbol',
            validations: [{
                in: ['staging', 'production']
            }]
        })
        .defaultValue({ [locale]: ['staging'] });

    // Add the new platformVisibility field
        siteGameV2.createField('platformVisibility')
        .name('Platform Visibility')
        .type('Array')
        .localized(false)
        .required(true)
        .disabled(false)
        .omitted(false)
        .items({
            type: 'Symbol',
            validations: [{
                in: ['web', 'ios', 'android']
            }]
        })
        .defaultValue({ [locale]: ['web', 'ios', 'android'] });

        siteGameV2.createField('showNetPosition')
        .name('showNetPosition')
        .type('Boolean')
        .localized(false)
        .required(false)
        .disabled(false)
        .omitted(false)
        .validations([])
        .defaultValue({
            [locale]: true
        });

        siteGameV2.changeFieldControl('showNetPosition', 'builtin', 'boolean', {});

    // Set the editor interface for the new field
    siteGameV2.changeFieldControl('liveHidden', 'builtin', 'boolean', {
        helpText: 'Indicates whether the game is hidden in live environment'
    });

    siteGameV2.changeFieldControl(
        'platformVisibility', // the field ID
        'builtin',           // or the extension ID if you're using a custom widget
        'checkbox',          // the widget you want to use
        {}
    );

    siteGameV2.changeFieldControl(
        'environmentVisibility', // the field ID
        'builtin',           // or the extension ID if you're using a custom widget
        'checkbox',          // the widget you want to use
        {}
    );

}) as MigrationFunction;
