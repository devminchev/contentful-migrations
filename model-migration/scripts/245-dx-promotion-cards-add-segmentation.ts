import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {
  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  const dxPromotionContentCard = migration.editContentType('dxPromotionContentCard');

  dxPromotionContentCard
    .createField('segmentation')
    .name('Segmentation')
    .type('Array')
    .localized(false)
    .required(true)
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

  dxPromotionContentCard.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the promotion content card should be active',
  });

}) as MigrationFunction; 