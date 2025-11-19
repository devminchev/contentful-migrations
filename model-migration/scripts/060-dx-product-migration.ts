import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxProduct = migration.createContentType('dxProduct').name('Dx Product').description('Digital Experience (Dx) Product that can help filter content based on product').displayField('entryTitle');

  dxProduct.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  dxProduct.createField('product').name('product').type('Symbol').required(true);
  dxProduct.changeFieldControl('entryTitle', 'builtin', 'singleLine', {
    helpText: 'The name of the Dx Product, for example: SPORTS, CASINO'
  });
  dxProduct.changeFieldControl('product', 'builtin', 'singleLine');


}) as MigrationFunction;