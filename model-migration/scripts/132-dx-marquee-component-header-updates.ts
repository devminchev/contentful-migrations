
import {MigrationFunction} from 'contentful-migration';

export = ((migration, space) => {
	const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

	// Dx Component Header
	const dxComponentHeader = migration.editContentType('dxComponentHeader');

	dxComponentHeader
		.createField('segmentation')
		.name('Segmentation')
		.type('Array')
		.localized(false)
		.items({
			type: 'Symbol',
			validations: [
				{
					in: ['showWhenLoggedIn', 'showWhenLoggedOut'],
				},
			],
		})
		.defaultValue({
			[LOCALE]: ['showWhenLoggedIn', 'showWhenLoggedOut']
		});
	dxComponentHeader.changeFieldControl('segmentation', 'builtin', 'checkbox', {
		helpText: 'The segment(s) where the Component Header should be active',
	});

	// Dx Marquee
	const dxMarquee = migration.editContentType('dxMarquee');

	dxMarquee.changeFieldControl('header', 'builtin', 'entryLinkEditor', {
		helpText: 'This field is deprecated and will be removed soon. Please do not use.'
	});

	dxMarquee
		.createField('headerV2')
		.name('Header')
		.type('Array')
		.items({
			type: 'Link',
			linkType: 'Entry',
			validations: [
				{
					linkContentType: [
						'dxComponentHeader'
					]
				}
			]
		});
	dxMarquee.changeFieldControl('headerV2', 'builtin', 'entryLinksEditor', {
		helpText: 'Species a header to be displayed above the marquee items with an icon, title and link. Accepts multiple headers for different user segmentation options, e.g. logged in or logged out.'
	});

	dxMarquee.moveField('headerV2').afterField('header');

}) as MigrationFunction;
