import { MigrationFunction } from "contentful-migration";

export = (migration => {
  const rgqmultiple = migration.editContentType('rgq-question-multiple-answers');
  rgqmultiple.createField('questionTag').name('Question Tag').type('Symbol').validations([
      {
        in: ['OCCUPATION', 'SALARY']
      }
    ]);

  const rqgsimple = migration.editContentType('rgq-question-single-answer');
  rqgsimple.createField('questionTag').name('Question Tag').type('Symbol').validations([
      {
        in: ['OCCUPATION', 'SALARY']
      }
    ]);


}) as MigrationFunction;
