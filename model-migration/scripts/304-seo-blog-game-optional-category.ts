import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    const seoBlog = migration.editContentType('seoBlog');
    const seoGame = migration.editContentType('seoGame');

    seoBlog.editField('category').required(false);
    seoGame.editField('category').required(false);

  }) as MigrationFunction;