import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
    const seoBlog = migration.editContentType('seoBlog');
    const seoGame = migration.editContentType('seoGame');
    const seoComponent = migration.editContentType('seoComponent');

    // SEO Blog:
    seoBlog.createField('numericalOrder')
        .name('Numerical Order')
        .type('Number')
        .required(false)
        .localized(false)
        .validations([
            {
                range: {
                    min: 0,
                    max: 20
                }
            }
        ])

    seoBlog.changeFieldControl('numericalOrder', 'builtin', 'numberEditor', {
        helpText: 'Set a number (max of 20) to order SEO Blog entries by it. If the field is empty or 0, no value will be returned for this field.'
    });
    seoBlog.moveField('numericalOrder').beforeField('canonical');

    // SEO Game:
    seoGame.createField('numericalOrder')
        .name('Numerical Order')
        .type('Number')
        .required(false)
        .localized(false)
        .validations([
            {
                range: {
                    min: 0,
                    max: 20
                }
            }
        ])

    seoGame.changeFieldControl('numericalOrder', 'builtin', 'numberEditor', {
        helpText: 'Set a number (max of 20) to order SEO Game entries by it. If the field is empty or 0, no value will be returned for this field.'
    });
    seoGame.moveField('numericalOrder').beforeField('canonical');

    // SEO Component:
    seoComponent.editField('sortBy')
    .validations([
        {
            in: ['numericalOrder', 'publishedDate', 'title']
        }
    ]);

}) as MigrationFunction;