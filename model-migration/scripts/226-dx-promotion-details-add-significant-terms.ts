import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
    const dxPromotionDetails = migration.editContentType('dxPromotionDetails');

    dxPromotionDetails
        .createField('significantTerms')
        .name('Significant Terms')
        .type('Object')
        .localized(true)
        .required(false);

    dxPromotionDetails.changeFieldControl('significantTerms', 'app', 'z2LsIOTTtkiEsfv1iiqtr', {
        helpText: 'The significant terms for the promotion.'
    })
}) as MigrationFunction;