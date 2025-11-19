import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsMatchList = migration.editContentType('sportsMatchList')

  sportsMatchList
    .createField('defaultMarketCategory')
    .required(false)
    .name('Default Market Category')
    .type('Symbol');

  sportsMatchList.moveField('defaultMarketCategory').afterField('showMarketSwitcher');

  sportsMatchList.changeFieldControl('defaultMarketCategory', 'builtin', 'singleLine', {
    helpText: 'The market category that is shown by default. Only applicable when all groups and fixtures are from the same SPORT.'
  });

}) as MigrationFunction;