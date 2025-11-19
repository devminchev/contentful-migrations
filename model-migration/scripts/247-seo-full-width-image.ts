import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxBanners = migration.editContentType('dxBanners')

  dxBanners.editField('type')
  .validations([
    {
      in: ['large', 'medium', 'slimline', 'multi_tile', 'carousel']
    }
  ]);

}) as MigrationFunction;
