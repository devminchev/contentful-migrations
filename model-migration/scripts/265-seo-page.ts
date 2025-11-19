import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Create SEO Page
  const seoPage = migration
    .createContentType('seoPage')
    .name('SEO Page')
    .description('SEO Page contains all the required components to construct a given page based off the slug, brand and jurisdiction.')
    .displayField('entryTitle');
  seoPage.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoPage
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .localized(true);
  seoPage.changeFieldControl("slug", "builtin", "singleLine", {
    helpText: "The page's slug e.g page-name or page-name/sub-page-name",
  });

  seoPage
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(false)
    .localized(true)
  seoPage.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "The Title to be displayed at the top of the page.",
  });

  seoPage
    .createField('headerOverride')
    .name('Header Override')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([
      {
        linkContentType: ['seoHeader']
      }
    ]);
  seoPage.changeFieldControl("headerOverride", "builtin", "entryLinkEditor", {
    helpText: "The header to be displayed at the top of the page to override the header set by the /seo/header endpoint. If left blank the default header will be used."
  });

  seoPage
    .createField('disableBreadcrumbs')
    .name('Disable Breadcrumbs')
    .type("Array")
    .required(false)
    .items({
      type: "Symbol",
      validations: [{
        in: ['Disable']
      }]
    });
  seoPage.changeFieldControl("disableBreadcrumbs", "builtin", "checkbox", {
    helpText: "Used to disable the breadcrumbs on the page.",
  });

  seoPage
    .createField("components")
    .name("Components")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [
            "dxBanners",
            "dxContent",
            "dxPlaceholder",
            "dxQuickLinks",
            "seoComponent",
            "seoFAQs",
            "seoHero"
          ],
        }
      ],
    });
  seoPage.changeFieldControl('components', 'builtin', 'entryLinksEditor', {
    helpText: 'A set of components that are used to construct the data on the page.'
  });

  seoPage
    .createField('footerOverride')
    .name('Footer Override')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([
      {
        linkContentType: ['dxFooter']
      }
    ]);
  seoPage.changeFieldControl("footerOverride", "builtin", "entryLinkEditor", {
    helpText: "The footer to be displayed at the bottom of the page to override the footer set by the /footer endpoint. If left blank the default footer will be used."
  });

  seoPage
    .createField('bonusInformationOverride')
    .name('Bonus Information Override')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([
      {
        linkContentType: ['dxContent']
      }
    ]);
  seoPage.changeFieldControl("bonusInformationOverride", "builtin", "entryLinkEditor", {
    helpText: "The Bonus Information to be displayed within the Footer this will override the bonusInformation field set by the /footer endpoint. If left blank the original bonusInformation data will be used."
  });

  seoPage
    .createField('metaTitle')
    .name('Meta Title')
    .type('Symbol')
    .required(false)
    .localized(true)
  seoPage.changeFieldControl("metaTitle", "builtin", "singleLine", {
    helpText: "A title to be used in the Meta data.",
  });

  seoPage
    .createField('metaDescription')
    .name('Meta Description')
    .type('Symbol')
    .required(false)
    .localized(true)
  seoPage.changeFieldControl("metaDescription", "builtin", "singleLine", {
    helpText: "A brief description of the page to be used in the Meta data.",
  });

  seoPage
    .createField('canonical')
    .name('Canonical')
    .type('Symbol')
    .required(false)
    .localized(false)
  seoPage.changeFieldControl("canonical", "builtin", "singleLine", {
    helpText: "A tag to help define the preferred version of a web page.",
  });

  seoPage
    .createField('jsonLD')
    .name('JSON LD')
    .type('Object')
    .required(false);
  seoPage.changeFieldControl('jsonLD', 'builtin', 'objectEditor', {
    helpText: 'A JSON field to input a small section of code to help Google etc crawl the site more effectively.',
  });

  seoPage
    .createField('brand')
    .name('Brand')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxBrand'],
      }
    ]);

  seoPage
    .createField('jurisdiction')
    .name('Jurisdiction')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxJurisdiction'],
      }
    ]);

}) as MigrationFunction;