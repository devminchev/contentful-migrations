import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	// Dx Promotion Details
	const dxPromotionDetails = migration.editContentType('dxPromotionDetails');

	dxPromotionDetails
		.createField('description2')
		.name('Description')
		.type('Object')
		.localized(true)
		.required(false);
	dxPromotionDetails.changeFieldControl('description2', 'app', 'z2LsIOTTtkiEsfv1iiqtr', {
		helpText: 'The description for the promotion.',
	});

	dxPromotionDetails
		.createField('terms2')
		.name('Terms')
		.type('Object')
		.localized(true)
		.required(false);
	dxPromotionDetails.changeFieldControl('terms2', 'app', 'z2LsIOTTtkiEsfv1iiqtr', {
		helpText: 'The terms for the promotion.',
	});

	migration.transformEntries({
		contentType: 'dxPromotionDetails',
		from: ['description'],
		to: ['description2'],
		transformEntryForLocale: async (from, locale) => {
			if (from.description[locale]) {
				return {
					description2: from.description[locale]
				}
			}
		}
	});

	migration.transformEntries({
		contentType: 'dxPromotionDetails',
		from: ['terms'],
		to: ['terms2'],
		transformEntryForLocale: async (from, locale) => {
			if (from.terms[locale]) {
				return {
					terms2: from.terms[locale]
				}
			}
		}
	});

	dxPromotionDetails.deleteField('description');

	dxPromotionDetails.editField('description2').name('Description');
	dxPromotionDetails.changeFieldId('description2', 'description');

	dxPromotionDetails.deleteField('terms');

	dxPromotionDetails.editField('terms2').name('Terms');
	dxPromotionDetails.changeFieldId('terms2', 'terms');

	
	// Dx Footer
	const dxFooter = migration.editContentType('dxFooter');

	dxFooter
		.createField('legalInfo2')
		.name('Legal Info')
		.type('Object')
		.localized(true)
		.required(false);
		dxFooter.changeFieldControl('legalInfo2', 'app', 'z2LsIOTTtkiEsfv1iiqtr');

	migration.transformEntries({
		contentType: 'dxFooter',
		from: ['legalInfo'],
		to: ['legalInfo2'],
		transformEntryForLocale: async (from, locale) => {
			if (from.legalInfo[locale]) {
				return {
					legalInfo2: from.legalInfo[locale]
				}
			}
		}
	});


	dxFooter.deleteField('legalInfo');

	dxFooter.editField('legalInfo2').name('Legal Info');
	dxFooter.changeFieldId('legalInfo2', 'legalInfo');
	dxFooter.moveField('legalInfo').afterField('footerIcons');
}) as MigrationFunction;
