import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
  const sportsEventGroupings = migration.editContentType('sportsEventGroupings');

  sportsEventGroupings.editField('paginationDateRange').name('Days Date Range')

  sportsEventGroupings.changeFieldControl('paginationDateRange', 'builtin', 'numberEditor', {
    helpText: 'The number of days to retrieve fixtures for (rolling range). e.g. days range = 7, at Wednesday 2pm, we will be retrieving fixtures 7 days into the future up to 2pm.',
  });
  
}) as MigrationFunction;