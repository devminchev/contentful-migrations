import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Create SEO Author
  const seoAuthor = migration.createContentType('seoAuthor').name('SEO Author').description('SEO Author will provide information about an Author.').displayField('entryTitle');
  seoAuthor.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoAuthor
    .createField("name")
    .name("Name")
    .type('Symbol')
    .required(true)
    .localized(false)
  seoAuthor.changeFieldControl("name", "builtin", "singleLine", {
    helpText: "The name of the Author to be displayed.",
  });

  seoAuthor
    .createField("key")
    .name("Key")
    .type('Symbol')
    .required(true)
    .localized(false)
    .validations([
      {
        unique: true,
      },
      {
        regexp: {
          pattern: "^[a-zà-ÿ-']*$",
          flags: ""
        },
      }
    ]);
  seoAuthor.changeFieldControl("key", "builtin", "singleLine", {
    helpText: "The key used to call the author via the endpoint. Should be all lowercase with dashes instead of spaces e.g joe-bloggs.",
  });

  seoAuthor
    .createField("bynderImage")
    .name("Bynder Image")
    .type('Object')
    .required(false)
    .localized(false)
  seoAuthor.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image to be used as a profile picture for the Author.',
  });

  seoAuthor
    .createField('bio')
    .name('Bio')
    .type('Object')
    .localized(true)
    .required(false);
  seoAuthor.changeFieldControl('bio', 'app', 'z2LsIOTTtkiEsfv1iiqtr', {
    helpText: 'A biography for the Author.'
  });

}) as MigrationFunction;