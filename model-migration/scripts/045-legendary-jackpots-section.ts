import { MigrationFunction } from "contentful-migration";

export = ((migration, space) => {
  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  const legendaryJackpotsSection = migration
    .createContentType("legendaryJackpotsSection")
    .name("Legendary Jackpots Section")
    .description("")
    .displayField("entryTitle");
  legendaryJackpotsSection
    .createField("entryTitle")
    .name("entryTitle")
    .type("Symbol")
    .required(true);
  legendaryJackpotsSection
    .createField("name")
    .name("name")
    .type("Symbol")
    .required(true);
  legendaryJackpotsSection
    .createField("provider")
    .name("provider")
    .type("Symbol")
    .required(true);
  legendaryJackpotsSection
    .createField("games")
    .name("games")
    .type("Array")
    .required(true)
    .items({
      linkType: "Entry",
      type: "Link",
      validations: [
        {
          linkContentType: ["siteGame"],
        },
      ],
    })
    .validations([
      {
        size: { min: 2 },
      },
    ]);
  legendaryJackpotsSection
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
  legendaryJackpotsSection
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
  legendaryJackpotsSection
    .createField("priorityOverride")
    .name("priorityOverride")
    .type("Number");

  legendaryJackpotsSection.changeFieldControl(
    "entryTitle",
    "builtin",
    "singleLine"
  );
  legendaryJackpotsSection.changeFieldControl("name", "builtin", "singleLine");
  legendaryJackpotsSection.changeFieldControl(
    "games",
    "builtin",
    "entryLinksEditor"
  );
  legendaryJackpotsSection.changeFieldControl("show", "builtin", "checkbox", {
    helpText: "In which context should the section appear?",
  });
  legendaryJackpotsSection.changeFieldControl(
    "provider",
    "builtin",
    "singleLine",
    {
      helpText: "The name of the game provider e.g roxor-legendary-jackpots",
    }
  );
  legendaryJackpotsSection.changeFieldControl("tileSize", "builtin", "radio", {
    helpText: "This controls the size of the tiles in the carousel",
  });
  legendaryJackpotsSection.changeFieldControl(
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
        linkContentType: ["legendaryJackpotsSection", "section"],
      },
    ],
  });
}) as MigrationFunction;
