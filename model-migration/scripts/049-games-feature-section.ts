import { MigrationFunction } from "contentful-migration";

export = ((migration, space) => {
  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  const gamesFeatureSection = migration
    .createContentType("gamesFeatureSection")
    .name("Games Feature Section")
    .description("")
    .displayField("entryTitle");
  gamesFeatureSection
    .createField("entryTitle")
    .name("entryTitle")
    .type("Symbol")
    .required(true);
  gamesFeatureSection
    .createField("name")
    .name("name")
    .type("Symbol")
    .required(true);
  gamesFeatureSection
    .createField("title")
    .name("title")
    .type("Symbol")
  gamesFeatureSection
    .createField("tileSize")
    .name("tileSize")
    .type("Symbol")
	.required(true)
    .validations([
      {
        in: ["standard", "tall", "wide"],
      },
    ])
    .defaultValue({
      [LOCALE]: "standard",
    });
  gamesFeatureSection
    .createField("type")
    .name("type")
    .type("Symbol")
	.required(true)
    .validations([
      {
        in: ["recommended-games"],
      },
    ])
    .defaultValue({
      [LOCALE]: "recommended-games",
    });
  gamesFeatureSection
    .createField("show")
    .name("show")
    .type("Array")
    .required(true)
    .items({
      type: "Symbol",
      validations: [
        {
          in: ["loggedIn", "loggedOut"],
        },
      ],
    });
  gamesFeatureSection
    .createField("priorityOverride")
    .name("priorityOverride")
    .type("Number");

  gamesFeatureSection.changeFieldControl(
    "entryTitle",
    "builtin",
    "singleLine"
  );
  gamesFeatureSection.changeFieldControl("name", "builtin", "singleLine");
  gamesFeatureSection.changeFieldControl("title", "builtin", "singleLine");
  gamesFeatureSection.changeFieldControl("show", "builtin", "checkbox", {
    helpText: "In which context should the section appear?",
  });
  gamesFeatureSection.changeFieldControl("tileSize", "builtin", "radio", {
    helpText: "This controls the size of the tiles in the carousel",
  });
  gamesFeatureSection.changeFieldControl("type", "builtin", "dropdown");
  gamesFeatureSection.changeFieldControl(
    "priorityOverride",
    "builtin",
    "numberEditor",
    {
      helpText:
        "Priority value to override ML decisions (do not use, unless advised)",
    }
  );

  const layout = migration.editContentType("layout");
  const sections = layout.editField("sections");
  sections.items({
    linkType: "Entry",
    type: "Link",
    validations: [
      {
        linkContentType: ["gamesFeatureSection", "section", "legendaryJackpotsSection"],
      },
    ],
  });
}) as MigrationFunction;
