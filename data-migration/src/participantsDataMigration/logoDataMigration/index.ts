import { ContentFields, MigrationFunction } from 'contentful-migration';
const uuid62 = require("uuid62");
// One off Migration taking the logos and alternative logos from Sports Participants
// and populate their own Sports Participant Logo content with the logos

// NB. Ran inside the model-migration folder with the below line replaced as export = ((migration) => {
const logoMigration = ((migration) => {

migration.transformEntriesToType({
  sourceContentType: 'sportsParticipant',
  targetContentType: 'sportsParticipantLogo',
  shouldPublish: true,
  updateReferences: false,
  removeOldEntries: false,
  identityKey: function(sourceContentType: ContentFields) {
    const id = uuid62.v4();
    return id;
  },
  transformEntryForLocale(fromFields: ContentFields, currentLocale: string) {
    return {
      entryTitle: `licensed_${fromFields.entryTitle['en-US'].toString()}_logo`,
      logo: fromFields.logo[currentLocale]
    };
  }
})

migration.transformEntriesToType({
  sourceContentType: 'sportsParticipant',
  targetContentType: 'sportsParticipantLogo',
  shouldPublish: true,
  updateReferences: false,
  removeOldEntries: false,
  identityKey: function(sourceContentType: ContentFields) {
    const value = sourceContentType.entryTitle['en-US'].toString() as string;
    return `licensed_${value}_alternative_logo`;
  },
  transformEntryForLocale(fromFields: ContentFields, currentLocale: string) {
    return {
      entryTitle: `licensed_${fromFields.entryTitle['en-US'].toString()}_alternative_logo`,
      logo: fromFields.alternativeLogo[currentLocale]
    };
  }
})
}) as MigrationFunction;