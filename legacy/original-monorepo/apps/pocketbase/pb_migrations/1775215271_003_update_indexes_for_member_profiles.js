/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("member_profiles");
  collection.indexes.push("CREATE UNIQUE INDEX idx_member_profiles_member_code ON member_profiles (member_code)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("member_profiles");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_member_profiles_member_code"));
  return app.save(collection);
})
