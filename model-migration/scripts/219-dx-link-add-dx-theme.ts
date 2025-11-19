import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
    // Dx Link Updates
    const dxLink = migration.editContentType('dxLink');

    dxLink
        .createField('theme')
        .name('Theme')
        .type('Link')
        .linkType('Entry')
        .validations([
            {
                linkContentType: ['dxTheme']
            }
        ]);

        dxLink.changeFieldControl('theme', 'builtin', 'entryLinkEditor', {
        helpText: 'The background theme that will be applied to the link, enabling the use of a background colour or image.'
    });

    dxLink.moveField('theme').afterField('bynderImage');
}) as MigrationFunction;
