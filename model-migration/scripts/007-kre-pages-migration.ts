import { IValidation, MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const jurisdiction = migration
    .createContentType('jurisdiction')
    .name('Jurisdiction')
    .description('')
    .displayField('entryTitle');
  jurisdiction.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  jurisdiction.createField('name').name('name').type('Symbol').required(true);
  jurisdiction.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  jurisdiction.changeFieldControl('name', 'builtin', 'singleLine');

  const venture = migration.editContentType('venture');
  venture
    .createField('jurisdiction')
    .name('jurisdiction')
    .type('Link')
    .required(true)
    .validations([
      {
        linkContentType: ['jurisdiction'],
      },
    ])
    .linkType('Entry');
  venture.changeFieldControl('jurisdiction', 'builtin', 'entryLinkEditor');

  const site = migration.createContentType('site').name('Site').description('').displayField('entryTitle');
  site.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  site.createField('name').name('name').type('Symbol').required(true);
  site.createField('fullName').name('fullName').type('Symbol').required(true);
  site.createField('utag').name('utag').type('Symbol');
  site
    .createField('venture')
    .name('venture')
    .type('Link')
    .required(true)
    .validations([
      {
        linkContentType: ['venture'],
      },
    ])
    .linkType('Entry');
  site.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  site.changeFieldControl('name', 'builtin', 'singleLine');
  site.changeFieldControl('fullName', 'builtin', 'singleLine');
  site.changeFieldControl('utag', 'builtin', 'singleLine');
  site.changeFieldControl('venture', 'builtin', 'entryLinkEditor');

  venture
    .createField('defaultSite')
    .name('defaultSite')
    .type('Link')
    .required(true)
    .validations([
      {
        linkContentType: ['site'],
      },
    ])
    .linkType('Entry');
  venture.changeFieldControl('defaultSite', 'builtin', 'entryLinkEditor');

  const kreYoti = migration.createContentType('kreYoti').name('KreYoti').description('').displayField('entryTitle');
  kreYoti.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  kreYoti.changeFieldControl('entryTitle', 'builtin', 'singleLine');

  const richTextNodeTypes = [
    'heading-1',
    'heading-2',
    'heading-3',
    'heading-4',
    'heading-5',
    'heading-6',
    'ordered-list',
    'unordered-list',
    'hr',
    'blockquote',
    'hyperlink',
    'entry-hyperlink',
    'embedded-entry-inline',
  ];

  const richTextValidationMessage =
    'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, ' +
    'horizontal rule, quote, link to Url, link to entry, and inline entry nodes are allowed';

  const kreSmallText = migration
    .createContentType('kreSmallText')
    .name('KreSmallText')
    .description('')
    .displayField('entryTitle');
  kreSmallText.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  kreSmallText.createField('title').name('title').type('Symbol').required(true);
  kreSmallText
    .createField('text')
    .name('text')
    .type('RichText')
    .required(true)
    .validations([
      {
        nodes: {
          'embedded-entry-inline': [
            {
              linkContentType: ['kreButton', 'kreYoti'],
            },
          ],
        },
      },
      {
        enabledNodeTypes: richTextNodeTypes,
        message: richTextValidationMessage,
      },
    ]);
  kreSmallText.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  kreSmallText.changeFieldControl('title', 'builtin', 'singleLine');
  kreSmallText.changeFieldControl('text', 'builtin', 'richTextEditor');

  const kreButton = migration
    .createContentType('kreButton')
    .name('KreButton')
    .description('')
    .displayField('entryTitle');
  kreButton.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  kreButton.createField('title').name('title').type('Symbol').required(true);
  kreButton.createField('label').name('label').type('Symbol').required(true);
  kreButton
    .createField('mode')
    .name('mode')
    .type('Symbol')
    .required(true)
    .validations([
      {
        in: ['transparent', 'default'],
      },
    ]);
  kreButton.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  kreButton.changeFieldControl('title', 'builtin', 'singleLine');
  kreButton.changeFieldControl('label', 'builtin', 'singleLine');
  kreButton.changeFieldControl('mode', 'builtin', 'dropdown');

  const kreSection = migration
    .createContentType('kreSection')
    .name('KreSection')
    .description('')
    .displayField('entryTitle');
  kreSection.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  kreSection.createField('title').name('title').type('Symbol').required(true);
  kreSection
    .createField('content')
    .name('content')
    .type('RichText')
    .required(true)
    .validations([
      {
        nodes: {
          'embedded-entry-inline': [
            {
              linkContentType: ['kreButton', 'kreSmallText', 'kreYoti'],
            },
          ],
        },
      },
      {
        enabledNodeTypes: richTextNodeTypes,
        message: richTextValidationMessage,
      },
    ]);
  kreSection.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  kreSection.changeFieldControl('title', 'builtin', 'singleLine');
  kreSection.changeFieldControl('content', 'builtin', 'richTextEditor');

  const memberTheme = migration
    .createContentType('memberTheme')
    .name('MemberTheme')
    .description('')
    .displayField('entryTitle');
  memberTheme.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  memberTheme.createField('name').name('name').type('Symbol').required(true);
  memberTheme.createField('theme').name('theme').type('Object').required(true);
  memberTheme.createField('logos').name('logos').type('Object').required(true);
  memberTheme
    .createField('site')
    .name('site')
    .type('Link')
    .required(true)
    .validations([
      {
        linkContentType: ['site'],
      },
    ])
    .linkType('Entry');
  memberTheme.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  memberTheme.changeFieldControl('name', 'builtin', 'singleLine');
  memberTheme.changeFieldControl('theme', 'builtin', 'objectEditor');
  memberTheme.changeFieldControl('logos', 'builtin', 'objectEditor');
  memberTheme.changeFieldControl('site', 'builtin', 'entryLinkEditor');

  const yotiRichTextValidation: IValidation[] = [
    {
      nodes: {
        'embedded-entry-inline': [
          {
            linkContentType: ['kreButton', 'kreSection', 'kreSmallText', 'kreYoti'],
          },
        ],
      },
    },
    {
      enabledNodeTypes: richTextNodeTypes,
      message: richTextValidationMessage,
    },
  ];

  const krePage = migration.createContentType('krePage').name('KrePage').description('').displayField('entryTitle');
  krePage.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  krePage.createField('title').name('title').type('Symbol').required(true);
  krePage
    .createField('site')
    .name('site')
    .type('Link')
    .required(true)
    .validations([
      {
        linkContentType: ['site'],
      },
    ])
    .linkType('Entry');
  krePage
    .createField('memberTheme')
    .name('memberTheme')
    .type('Link')
    .required(true)
    .validations([
      {
        linkContentType: ['memberTheme'],
      },
    ])
    .linkType('Entry');
  krePage.createField('helpChatUrl').name('helpChatUrl').type('Symbol').required(true);
  krePage
    .createField('stateDefault')
    .name('stateDefault')
    .type('RichText')
    .required(true)
    .validations(yotiRichTextValidation);
  krePage
    .createField('stateIdle')
    .name('stateIdle')
    .type('RichText')
    .required(true)
    .validations(yotiRichTextValidation);
  krePage
    .createField('stateYotiIsDown')
    .name('stateYotiIsDown')
    .type('RichText')
    .required(true)
    .validations(yotiRichTextValidation);
  krePage
    .createField('stateYotiLimitAccess')
    .name('stateYotiLimitAccess')
    .type('RichText')
    .required(true)
    .validations(yotiRichTextValidation);
  krePage
    .createField('stateYotiNonRecoverable')
    .name('stateYotiNonRecoverable')
    .type('RichText')
    .required(true)
    .validations(yotiRichTextValidation);
  krePage.changeFieldControl('entryTitle', 'builtin', 'singleLine');
  krePage.changeFieldControl('title', 'builtin', 'singleLine');
  krePage.changeFieldControl('site', 'builtin', 'entryLinkEditor');
  krePage.changeFieldControl('memberTheme', 'builtin', 'entryLinkEditor');
  krePage.changeFieldControl('helpChatUrl', 'builtin', 'singleLine', {
    helpText: 'Live Chat button link',
  });
  krePage.changeFieldControl('stateDefault', 'builtin', 'richTextEditor', {
    helpText: 'KrePage content when Yoti is disabled',
  });
  krePage.changeFieldControl('stateIdle', 'builtin', 'richTextEditor', {
    helpText: 'KrePage initial content when Yoti is enabled',
  });
  krePage.changeFieldControl('stateYotiIsDown', 'builtin', 'richTextEditor', {
    helpText: 'KrePage content when Yoti hits some an error',
  });
  krePage.changeFieldControl('stateYotiLimitAccess', 'builtin', 'richTextEditor', {
    helpText: 'KrePage content when Yoti is consistently down',
  });
  krePage.changeFieldControl('stateYotiNonRecoverable', 'builtin', 'richTextEditor', {
    helpText: 'KrePage content when user can no longer succeed with Yoti',
  });
}) as MigrationFunction;
