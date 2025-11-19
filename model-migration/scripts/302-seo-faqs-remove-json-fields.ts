import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const seoFAQs = migration.editContentType('seoFAQs')

  seoFAQs.deleteField('jsonLdQuestion');
  seoFAQs.deleteField('jsonLdAnswer');

}) as MigrationFunction;