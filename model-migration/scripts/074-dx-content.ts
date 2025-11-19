import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
	// Dx Content
	const dxContent = migration
		.createContentType('dxContent')
		.name('Dx Content')
		.description('Digital Experience (Dx) component for creating html content')
		.displayField('entryTitle');

	dxContent.createField('entryTitle').name('entryTitle').type('Symbol');

	// contentBody1
	dxContent
		.createField('content')
		.name('Content')
		.type('Object')
		.localized(true)
		.required(true);

	dxContent.changeFieldControl('content', 'app', 'z2LsIOTTtkiEsfv1iiqtr');

	// View updates
	const dxView = migration.editContentType('dxView');

	// Top Content
	  dxView.editField('topContent').items({
		  type: "Link",
		  linkType: "Entry",
	  validations: [
		{
		  linkContentType: [
			"dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxContent"
		  ],
		},
	  ],
	  });
  
	// Left Nav Content
	  dxView.editField('leftNavigationContent').items({
		  type: "Link",
		  linkType: "Entry",
	  validations: [
		{
		  linkContentType: [
			"dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxContent"
		  ],
		},
	  ],
	  });
  
	// Primary Content
	  dxView.editField('primaryContent').items({
		  type: "Link",
		  linkType: "Entry",
	  validations: [
		{
		  linkContentType: [
			"dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxPromotionDetails", "dxTabs", "dxPromotions", "dxBanners", "dxContent"
		  ],
		},
	  ],
	  });
  
	// Secondary Content
	dxView.editField('secondaryContent').items({
		  type: "Link",
		  linkType: "Entry",
	  validations: [
		{
		  linkContentType: [
			"dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxContent"
		  ],
		},
	  ],
	  });
  
	// Primary Empty Content
	dxView.editField('primaryEmptyContent').items({
		  type: "Link",
		  linkType: "Entry",
	  validations: [
		{
		  linkContentType: [
			"dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxContent"
		  ],
		},
	  ],
	  });
}) as MigrationFunction;
