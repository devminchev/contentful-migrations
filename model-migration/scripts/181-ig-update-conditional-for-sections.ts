import { MigrationFunction } from 'contentful-migration';

const parseArgs = (args: string[], acceptedArgs: string[]) =>
    args.reduce((acc, curr, idx) => {
        if (acceptedArgs.includes(curr)) {
            acc[curr] = args[idx + 1];
        }
        return acc;
    }, {} as Record<string, string>);

const parsedArgs = parseArgs(process.argv.slice(2), ['-s', '-a', '-e']);
const spaceId = parsedArgs['-s'];
const locale = spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

// your Conditional-Fields App ID
const CONDITIONAL_FIELDS_APP_ID = '28zlKGatzr5DR6vjy6GlvG';

export = ((migration) => {
    // 1. grab every section you need to patch
    const sectionIds = [
        'igGridASection',
        'igGridBSection',
        'igGridCSection',
        'igGridDSection',
        'igGridESection',
        'igGridFSection',
        'igGridGSection',
        'igCarouselA',
        'igCarouselB',
        'igJackpotsSection',
        'igMarketingSection',
        'igSimilarityBasedPersonalisedSection',
        'igCollabBasedPersonalisedSection',
    ];

    const sections = sectionIds.map(id => ({
        id,
        ct: migration.editContentType(id)
    }));

    sections.forEach(({ id, ct }) => {
        // 2. add the hidden + omitted validationStatus object field
        ct.createField('validationStatus')
            .name('Validation Status')
            .type('Object')
            .validations([{ size: { max: 0 } }])
            .disabled(true)
            .omitted(true);

        // 3a. swap in your app for viewAllAction
        ct.changeFieldControl(
            'viewAllAction',
            'app',
            CONDITIONAL_FIELDS_APP_ID,
            {
                helpText: 'View All action configuration',
                conditionSourceFieldId: 'viewAllType',
                conditionTriggerValue: 'view',
                conditionOperator: 'notEqual',
                conditionAction: 'hide',
                isRequired: true,
                isUniquePerVenture: false,
                isUniqueReferenceList: false
            }
        );

        ct.changeFieldControl(
            'viewAllActionText',
            'app',
            CONDITIONAL_FIELDS_APP_ID,
            {
                helpText: 'The text for the View All button',
                conditionSourceFieldId: 'viewAllType',
                conditionTriggerValue: 'none',
                conditionOperator: 'equal',
                conditionAction: 'hide',
                isRequired: false,
                isUniquePerVenture: false,
                isUniqueReferenceList: false
            }
        );        
        
        if (id !== 'igMarketingSection') {
            ct.editField('expandedSectionLayoutType')
                .required(false);
    
            // 3b. swap in your app for expandedSectionLayoutType
            ct.changeFieldControl(
                'expandedSectionLayoutType',
                'app',
                CONDITIONAL_FIELDS_APP_ID,
                {
                    helpText: 'The layoutType of the section when user clicks ViewAll',
                    conditionSourceFieldId: 'viewAllType',
                    conditionTriggerValue: 'auto',
                    conditionOperator: 'notEqual',
                    conditionAction: 'hide',
                    isRequired: true,
                    isUniquePerVenture: false,
                    isUniqueReferenceList: false
                }
            );
            ct.changeFieldControl(
                'slug',
                'app',
                CONDITIONAL_FIELDS_APP_ID,
                {
                    helpText: 'Unique slug identifying partial path to the section',
                    isRequired: true,
                    isUniquePerVenture: true,
                    isUniqueReferenceList: false
                }
            );
        }
    });

}) as MigrationFunction;
