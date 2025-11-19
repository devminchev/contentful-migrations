import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {

  // Edit Sports Event Grouping

  const sportsEventGrouping = migration.editContentType('sportsEventGroupings')

  sportsEventGrouping
  .createField('paginationDateRange')
  .name('Pagination Range')
  .type('Integer')
  .localized(false)
  .required(false)

  sportsEventGrouping.changeFieldControl('paginationDateRange', 'builtin', 'numberEditor', {
    helpText: 'Specifies the range for paginating fixtures by number of days.',
  });
}) as MigrationFunction;
