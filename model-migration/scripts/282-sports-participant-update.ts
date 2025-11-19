import Migration from 'contentful-migration';

export = ((migration: Migration) => {

    const sportsParticipantLogo = migration.editContentType('sportsParticipant')

    sportsParticipantLogo
        .createField('type')
        .name('Participant Type')
        .type('Symbol')
        .localized(false)
        .required(false)
        .validations([
            {
                in: ['PARTICIPANT', 'TEAM']
            }
        ]);

    sportsParticipantLogo.changeFieldControl("type", "builtin", "radio", {
        helpText: "Indicates the type of the participant."
    });

    sportsParticipantLogo.moveField('type').afterField('secondaryColor')

});