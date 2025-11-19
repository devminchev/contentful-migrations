import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Tooltip containing the icon
  const dxTooltip = migration.createContentType('dxTooltip').name('Dx Tooltip').description('Digital Experience (Dx) Tooltip will display useful information when the icon is clicked by the user.').displayField('entryTitle');
  dxTooltip.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  dxTooltip.createField('icon')
    .name('Icon')
    .type('Object')
    .required(true)
    .validations([
      {
        size: { max: 1 }
      }
    ]);
  dxTooltip.changeFieldControl('icon', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used as the icon for the tooltip.',
  });

  dxTooltip
    .createField('description')
    .name('Description')
    .type('Symbol')
    .required(true)
    .localized(true);
  dxTooltip.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'To be displayed above the main title e.g "EXPLAINING".'
  });

  dxTooltip
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true)
    .localized(true);
  dxTooltip.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'The title of what the tooltip is explaining.'
  });

  dxTooltip
    .createField('headerTheme')
    .name('Header Theme')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxTheme'],
      }
    ]);
  dxTooltip.changeFieldControl('headerTheme', 'builtin', 'entryLinkEditor', {
    helpText: 'Add a background theme to the header section of the Tooltip Content.'
  });

  dxTooltip
    .createField('content')
    .name('Content')
    .type('Object')
    .localized(true)
    .required(true);
  dxTooltip.changeFieldControl('content', 'app', 'z2LsIOTTtkiEsfv1iiqtr');

  const dxHeader = migration.editContentType('dxHeader');
  dxHeader
    .createField('tooltip')
    .name('Tooltip')
    .required(false)
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxTooltip'],
      }
    ]);
  dxHeader.changeFieldControl('tooltip', 'builtin', 'entryLinkEditor', {
    helpText: 'Add a Tooltip to give Users more information about this page.'
  });
  dxHeader.moveField('tooltip').afterField('title');

}) as MigrationFunction;