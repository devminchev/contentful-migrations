import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	const dxLocalisation = migration
		.createContentType('dxLocalisation')
		.name('Dx Localisation')
		.description('Digital Experience (Dx) component for creating and overriding language strings')
		.displayField('entryTitle');

	dxLocalisation.createField('entryTitle').name('entryTitle').type('Symbol');

	dxLocalisation
		.createField('key')
		.name('Key')
		.type('Symbol')
		.required(true);

	dxLocalisation.changeFieldControl('key', 'builtin', 'singleLine', {
		helpText: "The localisation key, for example: '__account-history__something-went-wrong'"
	});

	dxLocalisation
		.createField('value')
		.name('Value')
		.type('Text')
		.localized(true)
		.required(true);

	dxLocalisation.changeFieldControl('value', 'builtin', 'singleLine', {
		helpText: "The corresponding value for the localisation key"
	});

	dxLocalisation
		.createField("brand")
		.name("Brand")
		.type("Link")
		.localized(false)
		.required(true)
		.validations([
			{
				linkContentType: ["dxBrand"],
			},
		])
		.linkType("Entry");
	dxLocalisation.changeFieldControl("brand", "builtin", "entryLinkEditor", {
		helpText: "The brand where the Digital Experience (Dx) Localisation should be active",
	});

	dxLocalisation
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
	dxLocalisation.changeFieldControl("product", "builtin", "entryLinkEditor", {
		helpText: "The product where the Digital Experience (Dx) Localisation should be active",
	});

	dxLocalisation
		.createField("jurisdiction")
		.name("Jurisdiction")
		.type("Link")
		.localized(false)
		.validations([
			{
				linkContentType: ["dxJurisdiction"],
			},
		])
		.linkType("Entry");
	dxLocalisation.changeFieldControl("jurisdiction", "builtin", "entryLinkEditor", {
		helpText: "The jurisdiction where the Digital Experience (Dx) Localisation should be active",
	});

	dxLocalisation
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

	dxLocalisation.changeFieldControl("platform", "builtin", "checkbox", {
		helpText: "The platform where the Digital Experience (Dx) Localisation should be active",
	});

}) as MigrationFunction;
