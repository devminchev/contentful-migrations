import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const shortTextSizeValidation = [
    {
      size: {
        min: 1,
        max: 200,
      },
    },
  ];

  const richTextNodeTypes = [
    'asset-hyperlink',
    'heading-1',
    'heading-2',
    'heading-3',
    'ordered-list',
    'unordered-list',
    'hr',
    'hyperlink',
    'entry-hyperlink',
    'embedded-entry-block',
    'embedded-asset-block',
  ];

  const richTextContentValidations = [
    {
      nodes: {
        'embedded-entry-block': [
          {
            linkContentType: ['rgButton'],
          },
        ],
      },
    },
    {
      enabledNodeTypes: richTextNodeTypes,
    },
  ];

  const rgButton = migration.createContentType('rgButton').name('RGButton').displayField('title');
  rgButton.createField('title').name('title').type('Symbol').required(true);
  rgButton
    .createField('label')
    .name('label')
    .type('Symbol')
    .required(true)
    .validations([
      {
        size: {
          min: 1,
          max: 64,
        },
      },
    ]);

  const rgOverlayResultScreen = migration
    .createContentType('rgQuestionnaireResultScreen')
    .name('RGOverlayResultScreen')
    .displayField('title');

  rgOverlayResultScreen
    .createField('title')
    .name('title')
    .type('Symbol')
    .required(true)
    .validations(shortTextSizeValidation);

  rgOverlayResultScreen
    .createField('header')
    .name('Header')
    .type('Symbol')
    .required(true)
    .validations(shortTextSizeValidation);

  rgOverlayResultScreen
    .createField('content')
    .name('Content')
    .type('RichText')
    .required(true)
    .validations(richTextContentValidations);

  const rgQuestionnaireScreen = migration
    .createContentType('rgQuestionnaireScreen')
    .name('RGQuestionnaireScreen')
    .displayField('title');

  rgQuestionnaireScreen.createField('title').name('title').type('Symbol').required(true);
  rgQuestionnaireScreen.createField('header').name('header').type('Symbol').required(true);
  rgQuestionnaireScreen
    .createField('previousScreenButtonLabel')
    .name('previousScreenButtonLabel')
    .type('Symbol')
    .required(true)
    .validations(shortTextSizeValidation);

  rgQuestionnaireScreen
    .createField('submitButtonLabel')
    .name('submitButtonLabel')
    .type('Symbol')
    .required(true)
    .validations(shortTextSizeValidation);
  rgQuestionnaireScreen
    .createField('nextScreenButtonLabel')
    .name('nextScreenButtonLabel')
    .type('Symbol')
    .required(true)
    .validations(shortTextSizeValidation);

  const rgQuestionnaireWelcomeScreen = migration
    .createContentType('rgQuestionnaireWelcomeScreen')
    .name('RGQuestionnaireWelcomeScreen')
    .displayField('title');
  rgQuestionnaireWelcomeScreen.createField('title').name('title').type('Symbol').required(true);
  rgQuestionnaireWelcomeScreen
    .createField('header')
    .name('Header')
    .type('Symbol')
    .required(true)
    .validations(shortTextSizeValidation);

  rgQuestionnaireWelcomeScreen
    .createField('content')
    .name('Content')
    .type('RichText')
    .required(true)
    .validations(richTextContentValidations);

  rgQuestionnaireWelcomeScreen
    .createField('startButtonLabel')
    .name('Start button label')
    .type('Symbol')
    .required(true)
    .validations(shortTextSizeValidation);

  const rgQuestionnairePage = migration
    .createContentType('rgQuestionnairePage')
    .name('RGQuestionnairePage')
    .displayField('title');

  rgQuestionnairePage.createField('title').name('title').type('Symbol').required(true);
  rgQuestionnairePage
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .validations([
      {
        unique: true,
      },
    ]);
  rgQuestionnairePage
    .createField('welcomeScreen')
    .name('Welcome screen')
    .type('Link')
    .required(true)
    .validations([
      {
        linkContentType: ['rgQuestionnaireWelcomeScreen'],
      },
    ])
    .linkType('Entry');
  rgQuestionnairePage
    .createField('successScreen')
    .name('Succcess screen')
    .type('Link')
    .required(true)
    .validations([
      {
        linkContentType: ['rgQuestionnaireResultScreen'],
      },
    ])
    .linkType('Entry');
  rgQuestionnairePage
    .createField('failedScreen')
    .name('Failed screen')
    .type('Link')
    .required(true)
    .validations([
      {
        linkContentType: ['rgQuestionnaireResultScreen'],
      },
    ])
    .linkType('Entry');
  rgQuestionnairePage
    .createField('questionsScreen')
    .name('Questions screen')
    .type('Link')
    .required(true)
    .validations([
      {
        linkContentType: ['rgQuestionnaireScreen'],
      },
    ])
    .linkType('Entry');
}) as MigrationFunction;
