import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	// Digital Experience Link
	const dxLink = migration.editContentType('dxLink');

	dxLink
		.createField('linkType')
		.name('Link Type')
		.type('Symbol')
		.localized(false)
		.required(true)
		.validations([
			{
				in: ['default', 'sports_group'],
			},
		])
		.defaultValue({
			"en-US": "default"
		});

	dxLink.changeFieldControl('linkType', 'builtin', 'radio', {
		helpText: "This is the type of the link. sports_group should be chosen for any link to a sports group as this enables filtering out any links which don't have fixtures.",
	});

}) as MigrationFunction;
