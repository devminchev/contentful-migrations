import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Create SEO Hero
  const seoHero = migration
    .createContentType('seoHero')
    .name('SEO Hero')
    .description('SEO Hero allows a user to create a variety of Hero content using a mixture of images, links, text and themes.')
    .displayField('entryTitle');
  seoHero.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoHero
    .createField("components")
    .name("Components")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: ["dxBanner", "dxQuickLinks", "dxLink"],
        }
      ],
    })
    .validations([
      {
        size: {
          max: 5
        }
      }
    ]);
  seoHero.changeFieldControl('components', 'builtin', 'entryLinksEditor', {
    helpText: 'The components used to construct the Hero. Drag and drop the components into the order you want them to appear.'
  });

}) as MigrationFunction;