import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	const dxMarqueeBrazeTile = migration
		.createContentType('dxMarqueeBrazeTile')
		.name('Dx Marquee Braze Tile')
		.description('Digital Experience (Dx) Marquee Braze Tile to be used across Digital Experience products')
		.displayField('entryTitle');
	dxMarqueeBrazeTile.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

	dxMarqueeBrazeTile.createField('promotionFilter').name('Promotion Filter').type('Symbol').required(true);

	// Update the Marquee Items to include the Braze tile
	const dxMarquee = migration.editContentType('dxMarquee');
	dxMarquee.editField('marqueeItems').items({
		type: 'Link',
		linkType: 'Entry',
		validations: [
			{
				linkContentType: ['dxMarqueeCustomTile', 'dxMarqueeBrazeTile'],
			},
		],
	});
}) as MigrationFunction;
