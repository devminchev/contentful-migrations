import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
    const dxFooter = migration.editContentType('dxFooter');

    dxFooter.createField('paymentIcons')
        .name('Payment Icons')
        .type('Link')
        .required(false)
        .linkType('Entry')
        .validations([
            {
                linkContentType: ['dxQuickLinks'],
            }
        ]);
    dxFooter.changeFieldControl('paymentIcons', 'builtin', 'entryLinkEditor', {
        helpText: 'The payment icons to be displayed in the footer. They are used for jurisdictions that require separation of payment icons and RG links.'
    });
    dxFooter.moveField('paymentIcons').beforeField('footerIcons');
    
}) as MigrationFunction;