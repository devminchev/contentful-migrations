import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxBrand = migration.editContentType('dxBrand');

  dxBrand.createField('brands')
    .name('Brands')
    .type("Array")
    .items({
      type: 'Symbol'
    })
    .localized(false)
    .required(true);

  dxBrand.changeFieldControl('brands', 'builtin', 'tagEditor', {
    helpText: 'The brand to query against e.g. brand139 - representing BallyBet. This field must not start with a number due to constraints in our service'
  });

  // Dx Brand - Setting field to optional as we start to deprecate brand name
  dxBrand.editField('brand')
    .name('Brand')
    .type('Symbol')
    .required(false);

  dxBrand.changeFieldControl('brand', 'builtin', 'singleLine', {
    helpText: 'The name of the brand, for example: ballybet'
  });

  dxBrand.moveField('brand').afterField('brands');

}) as MigrationFunction;
