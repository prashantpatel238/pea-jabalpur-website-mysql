/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("custom_profile_fields");
  collection.indexes.push("CREATE UNIQUE INDEX idx_custom_profile_fields_field_key ON custom_profile_fields (field_key)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("custom_profile_fields");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_custom_profile_fields_field_key"));
  return app.save(collection);
})
