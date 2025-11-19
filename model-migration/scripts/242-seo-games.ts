import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const validation = {
    regexp: {
      pattern: `^(http:\\/\\/|https:\\/\\/|\\/)(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\\-\\/]))?$`
    },
    message: 'Input does not match the expected format. Example: url "https://play.ballybet.com/sports" or a relative path starting with "/". Please edit and try again.'
  }

  // Seo Game
  const seoGame = migration.createContentType('seoGame').name('SEO Game').description("SEO Game provides all the information for a Game based on the Jurisdiction and Brand.").displayField('entryTitle');
  seoGame.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoGame
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true)
    .localized(true)
  seoGame.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "The Title of the Game to be displayed.",
  });

  seoGame
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
  seoGame.changeFieldControl("key", "builtin", "singleLine", {
    helpText: "The Key to be used in fetch requests for Games. Must be all lowercase and with dashes instead of spaces e.g 10-swords",
  });

  seoGame.createField('bynderImage')
    .name('Bynder Image')
    .type('Object')
    .required(true)
    .localized(true)
    .validations([
      {
        size: {
          min: 1,
          max: 1
        }
      }
    ]);
  seoGame.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: "The main image used for the Game that is also displayed on other pages.",
  });

  seoGame
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
  seoGame.changeFieldControl('category', 'builtin', 'entryLinkEditor', {
    helpText: 'The category the Game belongs to.'
  });

  seoGame
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
        },
      ],
    })
    .validations([
      {
        size: {
          max: 5
        }
      }
    ]);
  seoGame.changeFieldControl('tags', 'builtin', 'entryLinksEditor', {
    helpText: 'The tags used to help filter this Game.'
  });

  seoGame
    .createField('provider')
    .name('Provider')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['seoProvider']
      }
    ]);
  seoGame.changeFieldControl('provider', 'builtin', 'entryLinkEditor', {
    helpText: 'The provider of this Game.'
  });

  seoGame
    .createField('content')
    .name('Content')
    .type('Object')
    .localized(true)
    .required(true);
  seoGame.changeFieldControl("content", "app", "z2LsIOTTtkiEsfv1iiqtr", {
    helpText: "An overview of the Game including information such as How to Play, Bonuses and Terms and Conditions.",
  });

  seoGame
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
  seoGame.changeFieldControl('socialMediaIcons', 'builtin', 'entryLinkEditor', {
    helpText: 'The Social Media links relating to the Game.'
  });

  seoGame
    .createField('jackpotId')
    .name('Jackpot Id')
    .type('Symbol')
    .required(false)
  seoGame.changeFieldControl("jackpotId", "builtin", "singleLine", {
    helpText: "The Id for the Game's jackpot (if applicable).",
  });

  seoGame
    .createField('canonical')
    .name('Canonical')
    .type('Symbol')
    .required(false)
    .localized(true)
  seoGame.changeFieldControl("canonical", "builtin", "singleLine", {
    helpText: "A tag to help define the preferred version of a web page.",
  });

  seoGame
    .createField('metaTitle')
    .name('Meta Title')
    .type('Symbol')
    .required(false)
    .localized(true)
  seoGame.changeFieldControl("metaTitle", "builtin", "singleLine", {
    helpText: "A title to be used in the Meta data.",
  });

  seoGame
    .createField('metaDescription')
    .name('Meta Description')
    .type('Symbol')
    .required(false)
    .localized(true)
    .validations([
      {
        size: {
          max: 155
        }
      }
    ])
  seoGame.changeFieldControl("metaDescription", "builtin", "singleLine", {
    helpText: "A brief description of the game to be used in the Meta data.",
  });

  seoGame
    .createField('registrationLink')
    .name('Registration Link')
    .type('Symbol')
    .required(false)
    .localized(true)
    .validations([validation]);
  seoGame.changeFieldControl("metaTitle", "builtin", "singleLine", {
    helpText: "A URL used to direct a user to a registration page. This will override the one provided by the Category field.",
  });

  seoGame
    .createField('jsonLD')
    .name('JSON LD')
    .type('Object')
    .required(false);
  seoGame.changeFieldControl('jsonLD', 'builtin', 'objectEditor', {
    helpText: 'A JSON field to input a small section of code to help Google etc crawl the site more effectively.',
  });

  seoGame
    .createField("jurisdiction")
    .name("Jurisdiction")
    .type("Array")
    .localized(false)
    .required(false)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: ["dxJurisdiction"],
        },
      ],
    });

  seoGame
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
