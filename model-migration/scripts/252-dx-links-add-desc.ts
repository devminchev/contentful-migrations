import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxBanner = migration.editContentType('dxBanner');
  dxBanner.editField('url').required(false);

  // Update Dx Link to allow Long Text
  const dxLink = migration.editContentType('dxLink');
  dxLink.createField('description')
    .name('Description')
    .type('Text')
    .localized(true)
    .required(false);
  dxLink.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'Description or long title of the Digital Experience (Dx) Link'
  });
  dxLink.moveField('description').afterField('title');

  // Add Themes to Dx Quick Links
  const dxQuickLinks = migration.editContentType('dxQuickLinks');

  dxQuickLinks
    .createField('theme')
    .name('Theme')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxTheme']
      }
    ]);
  dxQuickLinks.changeFieldControl('theme', 'builtin', 'entryLinkEditor', {
    helpText: 'The theme that will be applied to the set of Links, enabling the use of a background colour or image.'
  });

}) as MigrationFunction;
