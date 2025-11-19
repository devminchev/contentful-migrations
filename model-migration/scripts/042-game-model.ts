import { MigrationFunction, FieldType, IFieldOptions, BuiltinEditor } from 'contentful-migration';
const GAME_METADATA_PLATFORM_CONFIG_APP = '3WZ3tD2TDg6eqF7aK5jxG3';

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
    const gameV2 = migration
        .createContentType('gameV2')
        .name('Game Model V2')
        .description('V2 Games Model.')
        .displayField('entryTitle');

    const gameV2Fields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'entryTitle', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'gamePlatformConfig', options: { name: 'Game Platform Config', type: 'Object', required: true } },
        { id: 'platform', options: { name: 'platform', type: 'Array', items: { type: 'Symbol', validations: [{ in: ['Desktop', 'Tablet', 'Phone'] }] }, required: true } },
        { id: 'vendor', options: { name: 'vendor', type: 'Symbol', validations: [{ in: ['gamesys', 'roxor-rgp', 'lynx', 'engage', 'netent', 'evolution', 'igt', 'infinity'] }], required: true } },
        { id: 'showGameName', options: { name: 'showGameName', type: 'Boolean', defaultValue: { [locale]: false } } },
        { id: 'progressiveJackpot', options: { name: 'progressiveJackpot', type: 'Boolean', required: true, defaultValue: { [locale]: false } } },
        { id: 'operatorBarDisabled', options: { name: 'operatorBarDisabled', type: 'Boolean', required: true, defaultValue: { [locale]: false } } },
        { id: 'rgpEnabled', options: { name: 'rgpEnabled', type: 'Boolean', required: true, defaultValue: { [locale]: false } } },
        { id: 'funPanelEnabled', options: { name: 'funPanelEnabled', type: 'Boolean', required: true, defaultValue: { [locale]: false } } },
        { id: 'funPanelDefaultCategory', options: { name: 'funPanelDefaultCategory', type: 'Symbol' } },
        { id: 'representativeColor', options: { name: 'representativeColor', type: 'Symbol' } },
        { id: 'progressiveBackgroundColor', options: { name: 'progressiveBackgroundColor', type: 'Symbol' } },
        // { id: 'imgUrlPattern', options: { name: 'imgUrlPattern', type: 'Symbol', required: true, validations: [{ regexp: { pattern: "(^/api/content/gametiles/.*\\.(jpg|png|jpeg)$|^$)" }, message: "must be this format : /api/content/gametiles/double-bubble-logged-out/scale-s%s/double-bubble-tile-r%s-w%s.jpg" }] } },
        // { id: 'infoImgUrlPattern', options: { name: 'infoImgUrlPattern', type: 'Symbol', required: true, validations: [{ regexp: { pattern: "(^/api/content/gametiles/.*\\.(jpg|png|jpeg)$|^$)" }, message: "must be this format : /api/content/gametiles/double-bubble-logged-out/scale-s%s/double-bubble-tile-r%s-w%s.jpg" }] } },
        // { id: 'loggedOutImgUrlPattern', options: { name: 'loggedOutImgUrlPattern', type: 'Symbol', validations: [{ regexp: { pattern: "(^/api/content/gametiles/.*\\.(jpg|png|jpeg)$|^$)" }, message: "must be this format : /api/content/gametiles/double-bubble-logged-out/scale-s%s/double-bubble-tile-r%s-w%s.jpg" }] } },
        // { id: 'funPanelBackgroundImage', options: { name: 'funPanelBackgroundImage', type: 'Symbol', validations: [{ regexp: { pattern: "(^/api/content/gamebackgrounds/.*\\.(jpg|png|jpeg)$|^$)" }, message: "Must be this format : /api/content/gamebackgrounds/slot-colours/tile-0000-balloon-bonanza.png" }] } },
        { id: 'imgUrlPattern', options: { name: 'imgUrlPattern', type: 'Symbol', required: false } },
        { id: 'infoImgUrlPattern', options: { name: 'infoImgUrlPattern', type: 'Symbol', required: false } },
        { id: 'loggedOutImgUrlPattern', options: { name: 'loggedOutImgUrlPattern', type: 'Symbol' } },
        { id: 'funPanelBackgroundImage', options: { name: 'funPanelBackgroundImage', type: 'Symbol' } },

        { id: 'dfgWeeklyImgUrlPattern', options: { name: 'dfgWeeklyImgUrlPattern', type: 'Symbol' } },
        { id: 'videoUrlPattern', options: { name: 'videoUrlPattern', type: 'Symbol' } },
        { id: 'title', options: { name: 'title', type: 'Symbol', localized: true, required: true } },
        { id: 'maxBet', options: { name: 'maxBet', type: 'Symbol', localized: true } },
        { id: 'minBet', options: { name: 'minBet', type: 'Symbol', localized: true } },
        { id: 'infoDetails', options: { name: 'infoDetails', type: 'Text', localized: true } },
        { id: 'howToPlayContent', options: { name: 'howToPlayContent', type: 'Text', localized: true } },
        { id: 'introductionContent', options: { name: 'introductionContent', type: 'Text', localized: true } },
        { id: 'webComponentData', options: { name: 'webComponentData', type: 'Object' } },
        { id: 'tags', options: { name: 'tags', type: 'Array', items: { type: 'Symbol', validations: [{ in: ['sg-digital'] }] } } },
        { id: 'launchCode', options: { name: 'launchCode', type: 'Symbol' } },
        { id: 'nativeRequirement', options: { name: 'nativeRequirement', type: 'Object' } }
    ];

    gameV2Fields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = gameV2.createField(id).name(options.name as string).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.localized !== undefined) fieldInstance.localized(options.localized);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
    });

    const fieldControls = [
        { id: 'platform', widget: 'checkbox', helpText: 'On which platforms this game will load' },
        { id: 'vendor', widget: 'radio', helpText: 'Which vendor will load the game?' },
        { id: 'webComponentData', widget: 'objectEditor', helpText: 'Configuration for the web component' },
        { id: 'progressiveJackpot', widget: 'boolean', helpText: 'Does the game have a progressive jackpot?' },
        { id: 'imgUrlPattern', widget: 'singleLine', helpText: 'URL pattern for images that will be displayed alongside the game information' },
        { id: 'infoImgUrlPattern', widget: 'singleLine', helpText: 'URL pattern for images that will be displayed alongside the game information' },
        { id: 'maxBet', widget: 'singleLine', helpText: 'Maximum monetary bet amount that the game allows' },
        { id: 'minBet', widget: 'singleLine', helpText: 'Minimum monetary bet amount that the game allows' },
        { id: 'representativeColor', widget: 'singleLine', helpText: 'Colour associated with the game' },
        { id: 'howToPlayContent', widget: 'markdown', helpText: 'HTML copy describing how to play the game' },
        { id: 'infoDetails', widget: 'markdown', helpText: 'HTML copy describing the features of the game' },
        { id: 'introductionContent', widget: 'markdown', helpText: 'HTML copy introducing the game' },
        { id: 'loggedOutImgUrlPattern', widget: 'singleLine', helpText: 'URL pattern for images that represents the game for logged out users' },
        { id: 'progressiveBackgroundColor', widget: 'singleLine', helpText: 'Colour associated with the progressive jackpot' },
        { id: 'dfgWeeklyImgUrlPattern', widget: 'singleLine', helpText: 'URL pattern for images that will be displayed on the weekly DFG' },
        { id: 'videoUrlPattern', widget: 'singleLine', helpText: 'URL for a video that represents the game' },
        { id: 'rgpEnabled', widget: 'boolean', helpText: 'Should the game be loaded on the RGP? (only required for Gamesys vendor)' },
        { id: 'showGameName', widget: 'boolean', helpText: 'Should the game name be displayed while playing? (only required for Gamesys vendor)' },
        { id: 'funPanelEnabled', widget: 'boolean', helpText: 'Does the game support the multi game layout? (only required for Gamesys vendor)' },
        { id: 'funPanelDefaultCategory', widget: 'singleLine', helpText: 'Name of the default category to be shown in the mini game lobby on the multi game layout' },
        { id: 'funPanelBackgroundImage', widget: 'singleLine', helpText: 'URL of the image used for the page background if the game is loaded in the multi game layout' },
        { id: 'operatorBarDisabled', widget: 'boolean', helpText: 'Should the operator bar functionality be disabled?' },
        { id: 'tags', widget: 'tagEditor', helpText: 'Additional info / feature switches for the game' },
        { id: 'gamePlatformConfig', widget: 'app', helpText: 'Platform Configuration for Desktop & Mobile. Select the Mobile Override Checkbox to handle mobile specific fields for a game', widgetId: GAME_METADATA_PLATFORM_CONFIG_APP }
    ];

    fieldControls.forEach(({ id, widget, helpText, widgetId }) => {
            if (widgetId) {
                gameV2.changeFieldControl(id, 'app', widgetId, { helpText });
            } else {
                gameV2.changeFieldControl(id, 'builtin', widget as BuiltinEditor, { helpText });
            }
        });

    const siteGameV2 = migration
        .createContentType('siteGameV2')
        .name('Site Game V2')
        .description('V2 Site game Model')
        .displayField('entryTitle');

    const siteGameV2Fields: { id: string, options: IFieldOptions }[] = [
        { id: 'entryTitle', options: { name: 'entryTitle', type: 'Symbol', required: true, validations: [{ unique: true }] } },
        { id: 'venture', options: { name: 'venture', type: 'Link', validations: [{ linkContentType: ['venture'] }], linkType: 'Entry', required: true } },
        { id: 'game', options: { name: 'game', type: 'Link', validations: [{ linkContentType: ['gameV2'] }], linkType: 'Entry', required: true } },
        { id: 'environment', options: { name: 'environment', type: 'Array', items: { type: 'Symbol', validations: [{ in: ['staging', 'production'] }] }, required: true } },
        { id: 'sash', options: { name: 'sash', type: 'Symbol' } },
        { id: 'chat', options: { name: 'chat', type: 'Object' } },
        { id: 'maxBet', options: { name: 'maxBet', type: 'Symbol', localized: true } },
        { id: 'minBet', options: { name: 'minBet', type: 'Symbol', localized: true } },
        { id: 'howToPlayContent', options: { name: 'howToPlayContent', type: 'Text', localized: true } }
    ];

    siteGameV2Fields.forEach(field => {
        const { id, options } = field;
        const fieldInstance = siteGameV2.createField(id).name(options.name!).type(options.type as FieldType);
        if (options.required !== undefined) fieldInstance.required(options.required);
        if (options.localized !== undefined) fieldInstance.localized(options.localized);
        if (options.defaultValue !== undefined) fieldInstance.defaultValue(options.defaultValue);
        if (options.validations !== undefined) fieldInstance.validations(options.validations);
        if (options.items !== undefined) fieldInstance.items(options.items as IFieldOptions);
        if (options.linkType !== undefined) fieldInstance.linkType(options.linkType);
    });

    const siteGameControls = [
        { id: 'entryTitle', widget: 'singleLine' },
        { id: 'venture', widget: 'entryLinkEditor' },
        { id: 'environment', widget: 'checkbox', helpText: 'The environment(s) where the game is active' },
        { id: 'howToPlayContent', widget: 'markdown', helpText: 'HTML copy describing how to play the game' },
        { id: 'maxBet', widget: 'singleLine', helpText: 'Override default value' },
        { id: 'minBet', widget: 'singleLine', helpText: 'Override default value' },
        { id: 'sash', widget: 'singleLine', helpText: 'Configuration for the sash' },
        { id: 'chat', widget: 'objectEditor', helpText: 'Chat configuration' }
    ];

    siteGameControls.forEach(({ id, widget, helpText }) => {
        const options = helpText ? { helpText } : undefined;
        siteGameV2.changeFieldControl(id, 'builtin', widget as BuiltinEditor, options);
    });
}) as MigrationFunction;
