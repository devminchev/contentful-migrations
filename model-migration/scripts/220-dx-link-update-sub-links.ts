import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {
  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  // Updates Dx Link to allow SubLinks
  const dxLink = migration.editContentType('dxLink')

  dxLink
    .createField('hasDropdownMenu')
    .name('Has Dropdown Menu')
    .type('Boolean')
    .localized(false)
    .required(false)
    .defaultValue({
        [LOCALE]: false
    });
  dxLink.changeFieldControl('hasDropdownMenu', 'builtin', 'radio', {
    helpText: 'The "Has Dropdown Menu" field should only be selected if a Dx Link is to be used as a dropdown menu displaying a set of Dx Links.',
  });
  dxLink.moveField('hasDropdownMenu').afterField('linkType');

  dxLink
    .createField('dropdownMenuLinks')
    .name('Dropdown Menu Links')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Link',
      validations: [
        {
          'linkContentType': [
            'dxLink'
          ]
        }
      ],
      linkType: 'Entry'
    })
    .validations([
      {
        'size': { 'max': 25 },
        'message': 'A maximum of 25 sub-links can be added',
      },
    ]);
  dxLink.changeFieldControl('dropdownMenuLinks', 'builtin', 'entryLinksEditor', {
    helpText: 'IMPORTANT - "Has Dropdown Menu" MUST be SELECTED for these to be returned. Set of Dx Links that will appear as a dropdown list of sub-links underneath the parent Dx Link.'
  });
  dxLink.moveField('dropdownMenuLinks').afterField('hasDropdownMenu');

}) as MigrationFunction;