import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
    const welcomeOfferChoice = migration.editContentType('welcomeOffer');

    //New field for promo codes
    welcomeOfferChoice
        .createField('promoCodes')
        .name('Promo Codes')
        .type('Array')
        .required(false)
        .localized(false)
        .items({
            type: 'Symbol',
        });

    welcomeOfferChoice.changeFieldControl('promoCodes', 'builtin', 'tagEditor', {
        helpText: 'List of promo codes to be applied to the offer.'
    });

}) as MigrationFunction;