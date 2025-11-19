import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	// Sports  Content Document
	const dxContentDocument = migration
		.createContentType('dxContentDocument')
		.name('Dx Content Document')
		.description('Digital Experience (Dx) Content Document for managing compliance documents')
		.displayField('entryTitle');

	dxContentDocument.createField('entryTitle').name('entryTitle').type('Symbol');
	dxContentDocument.changeFieldControl('entryTitle', 'builtin', 'singleLine', {
		helpText: '[entry title] [state_code] [version] e.g. terms-and-conditions [bbaz] [1.0.0]',
	});

	dxContentDocument
		.createField('key')
		.name('Key')
		.type('Symbol')
		.localized(false)
		.required(true);

	dxContentDocument.changeFieldControl('key', 'builtin', 'singleLine', {
		helpText: 'Enter a key of a content document. e.g. terms-and-conditions, privacy-policy etc.',
	});

	dxContentDocument
		.createField('version')
		.name('Version')
		.type('Symbol')
		.localized(false)
		.required(true);
	dxContentDocument.changeFieldControl('version', 'builtin', 'singleLine', {
		helpText: 'e.g. 1.0.0',
	});

	// contentBody1
	dxContentDocument
		.createField('contentBody1')
		.name('Content Body (1)')
		.type('Object')
		.localized(true)
		.required(true);

	dxContentDocument.changeFieldControl('contentBody1', 'app', 'z2LsIOTTtkiEsfv1iiqtr');

	// contentBody2
	dxContentDocument
		.createField('contentBody2')
		.name('Content Body (2)')
		.type('Object')
		.localized(true)
		.required(false);
	dxContentDocument.changeFieldControl('contentBody2', 'app', 'z2LsIOTTtkiEsfv1iiqtr', {
		helpText: 'Note that this field will only be required if the character count has been exceed on the first content body.',
	});

	dxContentDocument
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

	dxContentDocument
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
}) as MigrationFunction;
