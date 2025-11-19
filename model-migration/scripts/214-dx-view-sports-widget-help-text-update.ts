import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsWidget = migration.editContentType('sportsWidget');
  sportsWidget.editField('filter');
  sportsWidget.changeFieldControl('filter', 'builtin', 'singleLine', {
    helpText: 'Add a filter so the widget only appears on specified pages. Filter options: "football/england" -> displays for English Football events, "football/england/premier_league" -> displays for Premier League events, "(football)|(tennis)|(live)" -> displays for football, tennis and all live events, "live/event/<event id>" -> displays for a specific live event.'
  });

  const dxView = migration.editContentType('dxView');
  dxView.changeFieldControl('paths', 'builtin', 'tagEditor', {
      helpText: "Used to determine which group or fixture pages this view should apply to. Only required for views with a key of 'group' or 'fixture'. Allows the use of wildcard {sport}, {region} or {competition}. Example: football or football/england/premier_league or football/{competition}"
  });

}) as MigrationFunction;