import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

  const LOCALE = space?.spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';

  const dxContent = migration.editContentType('dxContent');

  dxContent
    .createField('contextType')
    .name('Context Type')
    .type('Boolean')
    .localized(false)
    .required(false)
    .defaultValue({ [LOCALE]: false });

  dxContent.changeFieldControl('contextType', 'builtin', 'radio', {
    helpText: 'Used by the SEO team to differentiate between page and normal context to determine the type of formatting that needs to apply to the content.',
    trueLabel: 'Page Context',
    falseLabel: 'Normal Context'
  });

  dxContent.moveField('contextType').afterField('contentToggle');

}) as MigrationFunction;