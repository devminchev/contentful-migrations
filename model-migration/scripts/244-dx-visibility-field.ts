import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {
  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  const contentTypes = [
    'dxTabs',
    'dxQuickLinks',
    'dxMarquee',
    'dxHeader',
    'dxBanners',
    'dxPromotions'
  ];

  contentTypes.forEach(contentTypeId => {
    const contentType = migration.editContentType(contentTypeId);

    contentType
      .createField('visibility')
      .name('Visibility')
      .type('Array')
      .localized(false)
      .required(false)
      .validations([])
      .items({
        type: 'Symbol',
        validations: [
          {
            in: [
              'xs',
              'sm',
              'md',
              'lg',
              'blg',
              'xl'
            ]
          }
        ]
      })
      .defaultValue({
        [LOCALE]: ['xs', 'sm', 'md', 'lg', 'blg', 'xl']
      });

    contentType.changeFieldControl('visibility', 'builtin', 'checkbox', {
      helpText: 'Controls the visibility breakpoints for this component. Select which screen sizes the component should be displayed on.'
    });
  });
}) as MigrationFunction; 
