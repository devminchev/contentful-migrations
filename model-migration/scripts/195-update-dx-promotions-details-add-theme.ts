import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
    // Promotion Details Updates
    const dxPromotionDetails = migration.editContentType('dxPromotionDetails');

    dxPromotionDetails
        .createField('theme')
        .name('Theme')
        .type('Link')
        .linkType('Entry')
        .validations([
            {
                linkContentType: ['dxTheme']
            }
        ]);

    dxPromotionDetails.changeFieldControl('theme', 'builtin', 'entryLinkEditor', {
        helpText: 'The background theme that will be applied to the Promotion Details page.'
    });

    dxPromotionDetails.moveField('theme').afterField('bynderImage');
}) as MigrationFunction;
