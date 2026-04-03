/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.indexes.push("CREATE UNIQUE INDEX idx_members_email ON members (email)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_members_email"));
  return app.save(collection);
})
