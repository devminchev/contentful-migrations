import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const sportsLink = migration
    .createContentType('sportsLink')
    .name('Sports Link')
    .description(
      'Sports Links that can be managed and re-used across SportsBook, including Sports Quick Links, Sports Marquees, etc.'
    )
    .displayField('entryTitle');

  sportsLink.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsLink.createField('title').name('Title').type('Symbol').localized(false);
  sportsLink.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'Title of the Sports Link',
  });

  sportsLink.createField('url').name('Url').type('Symbol').localized(false);
  sportsLink.changeFieldControl('url', 'builtin', 'singleLine', {
    helpText: 'Full url to the destination',
  });

  sportsLink.createField('image').name('Image').type('Text').localized(false);
  sportsLink.changeFieldControl('image', 'builtin', 'singleLine', {
    helpText: 'Relative or Absolute path to Image in CDN',
  });
}) as MigrationFunction;
