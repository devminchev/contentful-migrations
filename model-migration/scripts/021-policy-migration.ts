import { MigrationFunction } from 'contentful-migration';
import { RICH_CONTENT_EDITOR } from './constants';

const POLICY_BODY_FIELD_NUM = 3; // number of body fields to concatenate

export = ((migration) => {
  const policy = migration.createContentType('policy').name('Policy').description('').displayField('entryTitle');

  policy.createField('entryTitle').name('entryTitle').type('Symbol');

  policy.createField('changeSummary').name('Summary of Change').type('Text');
  policy.changeFieldControl('changeSummary', 'builtin', 'multipleLine', {
    helpText: 'Track changes for T&Cs and privacy policies',
  });

  policy
    .createField('venture')
    .name('venture')
    .type('Link')
    .validations([{ linkContentType: ['venture'] }])
    .linkType('Entry');

  policy.createField('partner').name('partner').type('Boolean').required(true);
  policy.changeFieldControl('partner', 'builtin', 'boolean', {
    helpText: 'Is this policy page for partner site(s)?',
  });

  policy
    .createField('policyType')
    .name('policyType')
    .type('Symbol')
    .required(true)
    .validations([{ in: ['cookies-policy', 'modern-slavery-policy', 'privacy-policy', 'terms'] }]);
  policy.changeFieldControl('policyType', 'builtin', 'radio', {
    helpText: 'Type of the policy page',
  });

  policy.createField('title').name('title').type('Symbol').localized(true);
  policy.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'Title of the policy page',
  });

  for (let i = 1; i <= POLICY_BODY_FIELD_NUM; i++) {
    const fieldId = `body${i}`;
    policy.createField(fieldId).name(`body${i}`).type('Text').localized(true);
    // @ts-ignore
    policy.changeFieldControl(fieldId, 'app', RICH_CONTENT_EDITOR, {
      helpText: 'Content to be joint with other body fields',
    });
  }
}) as MigrationFunction;
