import { IFieldOptions } from 'contentful-migration';

// A small interface to help with typing
interface IFieldDefinition {
    id: string;
    options: IFieldOptions;
}

export type FieldControl = {
    id: string;
    widget: string;
    helpText: string;
    widgetId?: string;
};

// Export a function that returns the "view-all" fields array
export function viewAllFields(
    locale: string,
    // Optional overrides, keyed by the `id` of each field.
    overrides: Record<string, Partial<IFieldOptions>> = {}
): IFieldDefinition[] {
    // Base definitions
    const fields: IFieldDefinition[] = [
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
                type: 'Symbol',
                required: false,
                defaultValue: { [locale]: 'View All' },
                validations: []
            }
        },
        {
            id: 'viewAllType',
            options: {
                name: 'View All Type',
                type: 'Symbol',
                required: true,
                validations: [{ in: ['view', 'auto', 'none'] }]
            }
        },
        {
            id: 'expandedSectionLayoutType',
            options: {
                name: 'Expanded Section Layout Type',
                type: 'Symbol',
                required: true,
                defaultValue: { [locale]: 'grid-a' },
                validations: [{ in: ['grid-a', 'grid-e'] }]
            }
        }
    ];

    // Merge overrides
    return fields.map((field) => {
        const override = overrides[field.id];
        if (override) {
            return {
                ...field,
                options: {
                    ...field.options,
                    ...override
                }
            };
        }
        return field;
    });
}

// For field controls, you can simply export an array of objects:
export const viewAllFieldControls = [
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
    {
        id: 'expandedSectionLayoutType',
        widget: 'dropdown',
        helpText: 'The layoutType of the section when user clicks ViewAll'
    }
];
