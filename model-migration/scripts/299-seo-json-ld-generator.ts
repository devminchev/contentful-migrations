import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Seo Page
  const seoPage = migration.editContentType('seoPage')
  seoPage.createField('jsonLdGenerator')
    .name('Json Ld Generator')
    .type('Object')
    .required(false)
    .localized(false);
  seoPage.changeFieldControl('jsonLdGenerator', 'app', '2CCUKNuoW6QQav54Q3SC8I', {
    helpText: 'Press to Generate the JSON LD code for the page.',
  });

  seoPage.moveField('jsonLdGenerator').afterField('jsonLD');

  // Seo Blog
  const seoBlog = migration.editContentType('seoBlog')
  seoBlog.createField('jsonLdGenerator')
    .name('Json Ld Generator')
    .type('Object')
    .required(false)
    .localized(false);
  seoBlog.changeFieldControl('jsonLdGenerator', 'app', '2CCUKNuoW6QQav54Q3SC8I', {
    helpText: 'Press to Generate the JSON LD code for the blog.',
  });
  seoBlog.moveField('jsonLdGenerator').afterField('jsonLD');

  // Seo Game
  const seoGame = migration.editContentType('seoGame')
  seoGame.createField('jsonLdGenerator')
    .name('Json Ld Generator')
    .type('Object')
    .required(false)
    .localized(false);
  seoGame.changeFieldControl('jsonLdGenerator', 'app', '2CCUKNuoW6QQav54Q3SC8I', {
    helpText: 'Press to Generate the JSON LD code for the game.',
  });
  seoGame.moveField('jsonLdGenerator').afterField('jsonLD');

}) as MigrationFunction;