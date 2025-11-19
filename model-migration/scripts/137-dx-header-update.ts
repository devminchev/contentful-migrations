
import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	// Dx Header
	const dxHeader = migration.editContentType('dxHeader');

	dxHeader
		.createField('subtitle')
		.name('Subtitle')
		.type('Symbol')
		.localized(true)

	dxHeader.changeFieldControl('subtitle', 'builtin', 'singleLine', {
		helpText: 'A subtitle to be displayed underneath the Title',
	});

	dxHeader.moveField('subtitle').afterField('title');

	dxHeader
		.createField('headerType')
		.name('Header Type')
		.type('Symbol')
		.localized(false)
		.validations([
			{
				in: ['featured_header', 'standard_header']
			}
		])
		.defaultValue({ [LOCALE]: 'standard_header' })


	dxHeader.changeFieldControl('headerType', 'builtin', 'dropdown', {
		helpText: 'Used by the Frontend to determine the layout configuration.',
	});

}) as MigrationFunction;
