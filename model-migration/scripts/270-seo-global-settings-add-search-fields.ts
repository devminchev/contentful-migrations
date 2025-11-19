import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
    const seoGlobalSettings = migration.editContentType('seoGlobalSettings');
    
    seoGlobalSettings.createField('searchIcon')
        .name('Search Icon')
        .type('Object')
        .localized(false)
        .required(false)
        .validations([
            {
                size: {
                    min: 0,
                    max: 1
                },
                message: 'Please select only 1 file.'
            }
        ]);

    seoGlobalSettings.changeFieldControl('searchIcon', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
        helpText: 'The icon indicating there is a search component to use.',
    });

    seoGlobalSettings.createField('searchText')
        .name('Search Text')
        .type('Symbol')
        .localized(true)
        .required(false);

    seoGlobalSettings.changeFieldControl('searchText', 'builtin', 'singleLine', {
        helpText: 'The text to display in the search component.',
    });
    
    seoGlobalSettings.createField('searchRecommendations')
        .name('Search Recommendations')
        .type('Array')
        .localized(false)
        .required(false)
        .items({
            type: 'Link',
            linkType: 'Entry',
            validations: [
                {
                    linkContentType: ['seoComponent', 'dxQuickLinks'],
                }
            ]
        })

    seoGlobalSettings.changeFieldControl('searchRecommendations', 'builtin', 'entryLinksEditor', {
        helpText: 'The recommendations to display in the search component. Can be SEO Components or DX Quick Links.',
    });

    seoGlobalSettings.moveField('searchIcon').beforeField('brand');
    seoGlobalSettings.moveField('searchText').beforeField('brand');
    seoGlobalSettings.moveField('searchRecommendations').beforeField('brand');
}) as MigrationFunction;