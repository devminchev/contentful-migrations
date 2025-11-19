import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxFooter = migration.editContentType('dxFooter');

  dxFooter.editField('product')
  .required(false);

  dxFooter
  .createField('products')
  .name('Product')
  .type('Array')
  .required(true)
  .items({
    type: 'Link',
    linkType: 'Entry',
    validations: [
      {
        linkContentType: ['dxProduct']
      }
    ]
  });

}) as MigrationFunction;