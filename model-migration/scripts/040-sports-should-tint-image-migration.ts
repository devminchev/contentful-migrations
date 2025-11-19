import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
  // Sports Link
  const sportsLink = migration.editContentType("sportsLink");

  sportsLink
    .createField("shouldTintImage")
    .name("Should Tint Image")
    .type("Boolean")
    .localized(false);
  sportsLink.changeFieldControl("shouldTintImage", "builtin", "radio", {
    helpText:
      "Used to determine whether the image / icon should display tinted on the frontend. This will override any other logic surrounding tinting on the frontend.",
  });
  sportsLink.moveField("shouldTintImage").afterField("image");

  // Sports Tab Filter
  const sportsTabFilter = migration.editContentType("sportsTabItem");

  sportsTabFilter
    .createField("shouldTintImage")
    .name("Should Tint Image")
    .type("Boolean")
    .localized(false);
  sportsTabFilter.changeFieldControl("shouldTintImage", "builtin", "radio", {
    helpText:
      "Used to determine whether the image / icon should display tinted on the frontend. This will override any other logic surrounding tinting on the frontend.",
  });
  sportsTabFilter.moveField("shouldTintImage").afterField("image");

  // Sports Sport
  const sportsSport = migration.editContentType("sportsSport");

  sportsSport
    .createField("shouldTintImage")
    .name("Should Tint Image")
    .type("Boolean")
    .localized(false);
  sportsSport.changeFieldControl("shouldTintImage", "builtin", "radio", {
    helpText:
      "Used to determine whether the image / icon should display tinted on the frontend. This will override any other logic surrounding tinting on the frontend.",
  });
  sportsSport.moveField("shouldTintImage").afterField("image");
}) as MigrationFunction;
