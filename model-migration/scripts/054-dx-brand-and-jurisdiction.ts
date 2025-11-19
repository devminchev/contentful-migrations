import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	// Digital Experience Brand
	const dxBrand = migration
		.createContentType('dxBrand')
		.name('Dx Brand')
		.description(
			'Digital Experience (Dx) Brand that can help filter content based on brand'
		)
		.displayField('entryTitle');
	
	dxBrand.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

	dxBrand.createField('brand').name('Brand').type('Symbol').required(true);
	dxBrand.changeFieldControl('brand', 'builtin', 'singleLine', {
		helpText: 'The name of the brand, for example: ballybet'
	});

	// Digital Experience Jurisdiction
	const dxJurisdiction = migration
		.createContentType('dxJurisdiction')
		.name('Dx Jurisdiction')
		.description(
			'Digital Experience (Dx) Jurisdiction that can help filter content based on jurisdiction'
		)
		.displayField('entryTitle');
	
	dxJurisdiction.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

	dxJurisdiction.createField('jurisdiction').name('Jurisdiction').type('Symbol').required(false);
	dxJurisdiction.changeFieldControl('jurisdiction', 'builtin', 'singleLine', {
		helpText: 'The name of the jurisdiction, for example: US-AZ, CA-ON'
	});

}) as MigrationFunction;
