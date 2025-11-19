import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  // Create SEO Component
  const seoComponent = migration
    .createContentType('seoComponent')
    .name('SEO Component')
    .description('SEO Component contains the information needed to display either a set of Games or Blogs that match the criteria set within this model.')
    .displayField('entryTitle');
  seoComponent.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoComponent
    .createField('header')
    .name('Header')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([
      {
        linkContentType: ['dxComponentHeader']
      }
    ]);

  seoComponent
    .createField('component')
    .name('Component')
    .type("Boolean")
    .required(true)
    .defaultValue({
      [LOCALE]: true
    });
  seoComponent.changeFieldControl("component", "builtin", "radio", {
    helpText: "Used to determine if the Content field can be collapsable or not.",
    trueLabel: "Games",
    falseLabel: "Blogs"
  });

  seoComponent
    .createField('category')
    .name('Category')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['seoCategory']
      }
    ]);
  seoComponent.changeFieldControl('category', 'builtin', 'entryLinkEditor', {
    helpText: 'The category the Selected set of Components belongs to.'
  });

  seoComponent
    .createField("tags")
    .name("Tags")
    .type("Array")
    .required(false)
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
  seoComponent.changeFieldControl('tags', 'builtin', 'entryLinksEditor', {
    helpText: 'The tags used to help filter the Selected set of Components.'
  });

  seoComponent
    .createField('type')
    .name('Type')
    .type('Text')
    .required(true)
    .validations([
      {
        in: ['carousel', 'continuous-carousel', 'grid', 'list'],
      },
    ])
    .defaultValue({
      [LOCALE]: 'grid',
    });
  seoComponent.changeFieldControl('type', 'builtin', 'dropdown', {
    helpText: 'This will determine the layout for the Selected set of Components.',
  });

  seoComponent
    .createField('featured')
    .name('Featured')
    .type('Integer')
    .required(true)
    .validations(
      [
        {
          "range": {
            "min": 0,
            "max": 20
          }
        }
      ]
    )
    .defaultValue({
      [LOCALE]: 0,
    });
  seoComponent.changeFieldControl('featured', 'builtin', 'numberEditor', {
    helpText: 'The number of components to be shown using the "featured" layout.'
  });

  seoComponent
    .createField('limit')
    .name('Limit')
    .type('Integer')
    .required(false);
  seoComponent.changeFieldControl('limit', 'builtin', 'numberEditor', {
    helpText: 'The number of components to be shown. If left blank all components that match the criteria will be shown.'
  });

  seoComponent
    .createField('sortBy')
    .name('Sort By')
    .type('Text')
    .required(true)
    .validations([
      {
        in: ['publishedDate', 'title'],
      },
    ])
    .defaultValue({
      [LOCALE]: 'publishedDate',
    });
  seoComponent.changeFieldControl('sortBy', 'builtin', 'dropdown', {
    helpText: 'This will determine by which field the components are sorted by.',
  });

  seoComponent
    .createField('sortOrder')
    .name('Sort Order')
    .type("Boolean")
    .required(true)
    .defaultValue({
      [LOCALE]: false
    });
  seoComponent.changeFieldControl("sortOrder", "builtin", "radio", {
    helpText: "Used to determine if the components are sorted in ascending or descending order.",
    trueLabel: "Ascending",
    falseLabel: "Descending"
  });

}) as MigrationFunction;