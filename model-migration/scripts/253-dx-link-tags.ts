import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	const dxLink = migration.editContentType('dxLink');

	dxLink.createField('tags')
		.name('Tags')
		.type("Array")
		.items({
			type: 'Symbol'
		})
		.localized(false);

	dxLink.changeFieldControl('tags', 'builtin', 'tagEditor', {
		helpText: 'Tags associated with the link. For example: "rg_icon". These will be used by the frontends to attach additional functionality to the link, like filtering. '
	});

	dxLink.moveField('tags').afterField('linkType');
}) as MigrationFunction;
