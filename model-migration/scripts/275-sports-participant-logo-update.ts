import Migration from 'contentful-migration';

export = ((migration: Migration) => {

    const sportsParticipantLogo = migration.editContentType('sportsParticipantLogo')

    sportsParticipantLogo
        .createField('metadata')
        .name('Metadata')
        .type('Object')
        .localized(false)
        .required(false)
        .disabled(true)
});