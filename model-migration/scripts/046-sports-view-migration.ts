import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
  const sportsView = migration
    .createContentType("sportsView")
    .name("Sports View")
    .description("A collection of Sports View sections.")
    .displayField("entryTitle");

  sportsView.createField("entryTitle").name("entryTitle").type("Symbol");

  sportsView
    .createField("key")
    .name("Key")
    .type("Symbol")
    .required(true)
    .localized(false);

  sportsView.createField("sportId").name("Sport Id").type("Symbol");
  sportsView.changeFieldControl("sportId", "builtin", "singleLine", {
    helpText: "The Sport Id the view belongs to.",
  });

  sportsView.createField("regionId").name("Region Id").type("Symbol");
  sportsView.changeFieldControl("regionId", "builtin", "singleLine", {
    helpText: "The Region Id the view belongs to.",
  });

  sportsView.createField("competitionId").name("Competition Id").type("Symbol");
  sportsView.changeFieldControl("competitionId", "builtin", "singleLine", {
    helpText: "The Competition Id the view belongs to.",
  });

  sportsView
    .createField("topContent")
    .name("Top Content")
    .type("Array")
    .localized(false)
    .required(false)
    .validations(
      [
        {
          "size": {
            "max": 5
          }
        }
      ]
    )
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [ "sportsQuickLinks", "sportsMarquee", "sportsTabs" ],
        },
      ],
    });
  sportsView.changeFieldControl("topContent", "builtin", "entryLinksEditor", {
    helpText:
      "Used to determine what components will display in the top content section of the view.",
  });

  sportsView
    .createField("leftNavigationContent")
    .name("Left Navigation Content")
    .type("Array")
    .localized(false)
    .required(false)
    .validations(
      [
        {
          "size": {
            "max": 5
          }
        }
      ]
    )
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [ "sportsQuickLinks", "sportsMarquee", "sportsTabs" ],
        },
      ],
    });
  sportsView.changeFieldControl(
    "leftNavigationContent",
    "builtin",
    "entryLinksEditor",
    {
      helpText:
        "Used to determine what components will display in the left navigation content section of the view.",
    }
  );

  sportsView
    .createField("primaryContent")
    .name("Primary Content")
    .type("Array")
    .localized(false)
    .required(false)
    .validations(
      [
        {
          "size": {
            "max": 5
          }
        }
      ]
    )
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [ "sportsQuickLinks", "sportsMarquee", "sportsTabs" ],
        },
      ],
    });
  sportsView.changeFieldControl(
    "primaryContent",
    "builtin",
    "entryLinksEditor",
    {
      helpText:
        "Used to determine what components will display in the primary content section of the view.",
    }
  );

  sportsView
    .createField("secondaryContent")
    .name("Secondary Content")
    .type("Array")
    .localized(false)
    .required(false)
    .validations(
      [
        {
          "size": {
            "max": 5
          }
        }
      ]
    )
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [ "sportsQuickLinks", "sportsMarquee", "sportsTabs" ],
        },
      ],
    });
  sportsView.changeFieldControl(
    "secondaryContent",
    "builtin",
    "entryLinksEditor",
    {
      helpText:
        "Used to determine what components will display in the secondary content section of the view.",
    }
  );

  sportsView
    .createField("primaryEmptyContent")
    .name("Primary Empty Content")
    .type("Array")
    .localized(false)
    .required(false)
    .validations(
      [
        {
          "size": {
            "max": 5
          }
        }
      ]
    )
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [ "sportsQuickLinks", "sportsMarquee", "sportsTabs" ],
        },
      ],
    });
  sportsView.changeFieldControl(
    "primaryEmptyContent",
    "builtin",
    "entryLinksEditor",
    {
      helpText:
        "Used to determine what components should display in the primary content section of the view if no external data is available.",
    }
  );

  sportsView
    .createField("venture")
    .name("Venture")
    .type("Link")
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: [ "venture" ],
      },
    ])
    .linkType("Entry");
  sportsView.changeFieldControl("venture", "builtin", "entryLinkEditor", {
    helpText: "The venture where the Sports View should be active.",
  });

  sportsView
    .createField("platform")
    .name("Platform")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([
      {
        in: [ "WEB", "NATIVE", "ANDROID", "IOS", "RETAIL" ],
      },
    ]);

  sportsView.changeFieldControl("platform", "builtin", "radio", {
    helpText: "The platform where the Sports View should be active.",
  });
}) as MigrationFunction;
