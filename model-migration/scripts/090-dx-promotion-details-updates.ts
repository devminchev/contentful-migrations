import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	// Promotion Details Updates
	const dxPromotionDetails = migration.editContentType('dxPromotionDetails');

	dxPromotionDetails
		.createField('bynderImage')
		.name('Bynder Image')
		.localized(true)
		.type('Object');
	// 5KySdUzG7OWuCE2V3fgtIa is the ID for the Bynder Image App
	dxPromotionDetails.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
		helpText: 'The Bynder image to be used for the promotion details page',
	});

	dxPromotionDetails.moveField('bynderImage').afterField('image');
}) as MigrationFunction;
