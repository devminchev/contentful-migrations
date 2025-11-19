import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    // Dx Header

    const dxHeader = migration.editContentType('dxHeader');
    dxHeader.editField('title').localized(true);

    // Sports PrePack Tab Item

    const sportsPrePackTabItem = migration.editContentType('sportsPrePackTabItem');
    sportsPrePackTabItem.editField('name').localized(true);

    // Sports Parlay Builder Tab Item

    const sportsParlayBuilderTabItem = migration.editContentType('sportsParlayBuilderTabItem');
    sportsParlayBuilderTabItem.editField('name').localized(true);

    // Sports Participants

    const sportsParticipant = migration.editContentType('sportsParticipant');

    sportsParticipant.editField('name').localized(true)
    sportsParticipant.editField('shortName').localized(true)
    sportsParticipant.editField('alternativeName').localized(true)

}) as MigrationFunction;