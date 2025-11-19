import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const memberAnswer = migration.createContentType('memberAnswer').name('Member answer').displayField('title');
  memberAnswer.createField('title').name('title').type('Symbol').required(true);
  memberAnswer.createField('isCorrect').name('correctAnswer').type('Boolean').required(true);
  memberAnswer.createField('content').name('content').type('RichText').required(true);

  const memberQuestion = migration.createContentType('memberQuestion').name('Member question').displayField('title');
  memberQuestion.createField('title').name('title').type('Symbol').required(true);
  memberQuestion.createField('content').name('content').type('RichText').required(true);
  memberQuestion
    .createField('answers')
    .name('answers')
    .type('Array')
    .items({
      linkType: 'Entry',
      type: 'Link',
      validations: [
        {
          linkContentType: ['memberAnswer'],
        },
      ],
    })
    .required(true);

  const memberQuestionnaire = migration
    .createContentType('memberQuestionnaire')
    .name('Member questionnaire')
    .displayField('title');
  memberQuestionnaire.createField('title').name('title').type('Symbol');
  memberQuestionnaire
    .createField('name')
    .name('name')
    .type('Symbol')
    .required(true)
    .validations([
      {
        unique: true,
      },
    ]);
  memberQuestionnaire
    .createField('questions')
    .name('questions')
    .type('Array')
    .items({
      linkType: 'Entry',
      type: 'Link',
      validations: [
        {
          linkContentType: ['memberQuestion'],
        },
      ],
    })
    .required(true);
  memberQuestionnaire
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
}) as MigrationFunction;
