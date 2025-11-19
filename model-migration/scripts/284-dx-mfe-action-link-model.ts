import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
    // Create the new Dx MFE Action Link model:
    const dxMFEActionLink = migration
        .createContentType('dxMfeActionLink')
        .name('Dx MFE Action Link')
        .description('This is a MFE Action Link that can be referenced as one to many inside the Dx Link.')

    dxMFEActionLink
        .createField('entryTitle')
        .name('entryTitle')
        .type('Symbol')
        .required(true);

    dxMFEActionLink.displayField('entryTitle')

    dxMFEActionLink
        .createField('mfeActionLink')
        .name('MFE Action Link')
        .type('Object')
        .localized(false)
        .required(true)

    dxMFEActionLink.changeFieldControl('mfeActionLink', 'builtin','objectEditor', {
        helpText: 'Setup for MFE Navigation Events.'
    })

    // Add a new MFE Action Links field on Dx Link:
    const dxLink = migration.editContentType('dxLink')
    dxLink
        .createField('mfeActionLinks')
        .name('MFE Action Links')
        .type('Array')
        .localized(false)
        .required(false)
        .items({
            type: 'Link',
            validations: [
                {
                    'linkContentType': [
                        'dxMfeActionLink'
                    ]
                }
            ],
            linkType: 'Entry'
        })
        .validations([
            {
                'size': { 'max': 3 },
                'message': 'A maximum of 3 sub-links can be added.',
            }
        ])
    dxLink.changeFieldControl('mfeActionLinks', 'builtin', 'entryLinksEditor', {
        helpText: 'Setup for one or many MFE Action Links.'
    })

    // Add a helptext for deprecation of the original MFE Action Link:
    dxLink.changeFieldControl('mfeActionLink', 'builtin', 'objectEditor', {
        helpText: 'This is a deprecated field. Please, use the MFE Action Links field instead.'
    })

}) as MigrationFunction;