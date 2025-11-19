import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
  // Sports Sport
  const sportsSport = migration.editContentType("sportsSport");

  sportsSport.editField("image").required(true);
}) as MigrationFunction;
