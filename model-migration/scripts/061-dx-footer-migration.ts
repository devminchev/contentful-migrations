import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxFooter = migration.createContentType('dxFooter').name('Dx Footer').description('Digital Experience (Dx) Footer that will be displayed at the bottom of each page that includes state specific legal information.').displayField('entryTitle');
  dxFooter.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  dxFooter
    .createField('brandIcon')
    .name('Brand Icon')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxLink'],
      }
    ]);

  dxFooter
    .createField('lastLogin')
    .name('Last Login')
    .type('Boolean');

  dxFooter
    .createField('serverTime')
    .name('Server Time')
    .type('Boolean');

  dxFooter
    .createField('sessionTime')
    .name('Session Time')
    .type('Boolean');

  dxFooter
    .createField('navigationLinks')
    .name('Navigation Links')
    .type('Link')
    .localized(true)
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxQuickLinks'],
      }
    ]);

  dxFooter
    .createField('footerIcons')
    .name('Footer Icons')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxQuickLinks'],
      }
    ]);

  dxFooter
    .createField('legalInfo')
    .name('Legal Info')
    .type('RichText')
    .localized(true)
    .required(true)
		.validations([
      {
				"enabledMarks": [
					"bold",
					"italic",
					"underline",
					"code",
					"superscript",
					"subscript"
				],
				"message": "Only bold, italic, underline, code, superscript, and subscript marks are allowed"
			},
			{
				"enabledNodeTypes": [
					"heading-1",
					"heading-2",
					"heading-3",
					"heading-4",
					"heading-5",
					"heading-6",
					"ordered-list",
					"unordered-list",
					"hr",
					"blockquote",
					"table",
					"hyperlink"
				],
				"message": "Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, table, and link to Url nodes are allowed"
			},
			{
				"nodes": {}
			}
		]);

  dxFooter
    .createField('socialMediaIcons')
    .name('Social Media Icons')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxQuickLinks'],
      }
    ]);

  dxFooter
    .createField('brand')
    .name('Brand')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxBrand'],
      }
    ]);

  dxFooter
    .createField('jurisdiction')
    .name('Jurisdiction')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxJurisdiction'],
      }
    ]);

  dxFooter
    .createField("platform")
    .name("Platform")
    .type("Array")
    .localized(false)
    .required(true)
    .validations([])
    .items({
      type: "Symbol",
      validations: [{
        in: ['WEB', 'ANDROID', 'IOS']
      }]
    });

  dxFooter.changeFieldControl("platform", "builtin", "checkbox", {
    helpText: "The platform where the Dx Footer should be active.",
  });

  dxFooter
  .createField('product')
  .name('Product')
  .type('Link')
  .required(true)
  .linkType('Entry')
  .validations([
    {
      linkContentType: ['dxProduct'],
    }
  ]);

}) as MigrationFunction;