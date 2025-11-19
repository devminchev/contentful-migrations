import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Create SEO Blog
  const seoBlog = migration
    .createContentType('seoBlog')
    .name('SEO Blog')
    .description('SEO Blog will contain all the information, such as title, images, content and categories for a Blog entry.')
    .displayField('entryTitle');
  seoBlog
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol')
    .required(true);
  seoBlog.changeFieldControl("entryTitle", "builtin", "singleLine", {
    helpText: "Enter to reflect the URL using the category and key e.g blog/slots/a-blog-about-slots",
  });

  seoBlog
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true)
    .localized(true)
  seoBlog.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "The Title to be displayed at the top of the Blog's page e.g The History of Bingo",
  });

  seoBlog
    .createField('key')
    .name('Key')
    .type('Symbol')
    .required(true)
    .localized(false)
    .validations([
      {
        unique: true,
      },
      {
        regexp: {
          pattern: "^[a-z0-9-]*$"
        }
      }
    ]);
  seoBlog.changeFieldControl("key", "builtin", "singleLine", {
    helpText: "Used in the fetch request for the blog. Must be all lowercase and with dashes instead of spaces e.g history-of-bingo",
  });

  seoBlog
    .createField('category')
    .name('Category')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['seoCategory']
      }
    ]);
  seoBlog.changeFieldControl('category', 'builtin', 'entryLinkEditor', {
    helpText: 'The category the Blog belongs to.'
  });

  seoBlog
    .createField("tags")
    .name("Tags")
    .type("Array")
    .localized(false)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: ["seoTag"],
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
  seoBlog.changeFieldControl('tags', 'builtin', 'entryLinksEditor', {
    helpText: 'The tags used to help filter this Blog.'
  });

  seoBlog
    .createField('metaTitle')
    .name('Meta Title')
    .type('Symbol')
    .required(false)
    .localized(true)
  seoBlog.changeFieldControl("metaTitle", "builtin", "singleLine", {
    helpText: "A title to be used in the Meta data.",
  });

  seoBlog
    .createField('metaDescription')
    .name('Meta Description')
    .type('Symbol')
    .required(false)
    .localized(true)
  seoBlog.changeFieldControl("metaDescription", "builtin", "singleLine", {
    helpText: "A brief description of the blog to be used in the Meta data.",
  });

  seoBlog
    .createField('publishedDate')
    .name('Published Date')
    .type('Date')
    .required(true);
  seoBlog.changeFieldControl("publishedDate", "builtin", "datePicker", {
    format: 'dateonly',
    helpText: "The date the Blog was published."
  });

  seoBlog
    .createField('author')
    .name('Author')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['seoAuthor']
      }
    ]);
  seoBlog.changeFieldControl('author', 'builtin', 'entryLinkEditor', {
    helpText: 'The Author of the Blog. Only one allowed.'
  });

  seoBlog.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .required(false)
    .localized(true)
    .validations([
      {
        size: {
          min: 1,
          max: 1
        }
      }
    ]);
  seoBlog.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: "The main image used for the Blog that is also displayed on other pages.",
  });

  seoBlog
    .createField('caption')
    .name('Caption')
    .type('Symbol')
    .required(false)
    .localized(true)
  seoBlog.changeFieldControl("caption", "builtin", "singleLine", {
    helpText: "A caption for the above image that will be displayed by the Front End.",
  });

  seoBlog
    .createField('socialMediaIcons')
    .name('SocialMediaIcons')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxQuickLinks']
      }
    ]);
  seoBlog.changeFieldControl('socialMediaIcons', 'builtin', 'entryLinkEditor', {
    helpText: 'The Social Media links relating to the Blog.'
  });

  seoBlog
    .createField('introduction')
    .name('Introduction')
    .type('Symbol')
    .required(false)
    .localized(true)
  seoBlog.changeFieldControl("introduction", "builtin", "singleLine", {
    helpText: "A brief introduction to the Blog. Text to be displayed at the top of the Blog's page and also on the Blogs Group page.",
  });

  seoBlog
    .createField('content')
    .name('Content')
    .type('Object')
    .localized(true)
    .required(true);
  seoBlog.changeFieldControl('content', 'app', 'z2LsIOTTtkiEsfv1iiqtr');

  seoBlog
    .createField('canonical')
    .name('Canonical')
    .type('Symbol')
    .required(false)
    .localized(true)
  seoBlog.changeFieldControl("canonical", "builtin", "singleLine", {
    helpText: "A tag to help define the preferred version of a web page.",
  });

  seoBlog
    .createField('jsonLD')
    .name('JSON LD')
    .type('Object')
    .required(false);
  seoBlog.changeFieldControl('jsonLD', 'builtin', 'objectEditor', {
    helpText: 'A JSON field to input a small section of code to help Google etc crawl the site more effectively.',
  });

  seoBlog
    .createField("brand")
    .name("Brand")
    .type("Array")
    .localized(false)
    .required(true)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: ["dxBrand"],
        },
      ],
    });

}) as MigrationFunction;
