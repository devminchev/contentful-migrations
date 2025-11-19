import Migration from 'contentful-migration';

export = ((migration: Migration) => {

    const sportsParticipantLogo = migration.editContentType('sportsParticipantLogo')

    sportsParticipantLogo
        .createField('madeBy')
        .name('Made By')
        .type('Symbol')
        .localized(false)
        .required(false)
        .validations([
            {
                in: ['AI', 'Design']
            }
        ]);

    sportsParticipantLogo.changeFieldControl("madeBy", "builtin", "radio", {
        helpText: "Indicates wether the logo was made by the Design team or AI generated"
    });

    sportsParticipantLogo.moveField('madeBy').afterField('isUnlicensed')

});
