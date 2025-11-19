import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxView = migration.editContentType('dxView');

  // Secondary Content
  dxView.editField('secondaryContent').items({
		type: "Link",
		linkType: "Entry",
    validations: [
      {
        linkContentType: [
          "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxBanners", "dxTabs", "dxContent",
        ],
      },
    ],
	});

}) as MigrationFunction;