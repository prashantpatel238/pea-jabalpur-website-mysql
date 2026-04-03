/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.listRule = "@request.auth.id != \"\" || @request.auth.collectionName = \"users\"";
  collection.viewRule = "@request.auth.id != \"\" || @request.auth.collectionName = \"users\"";
  collection.createRule = "";
  collection.updateRule = "@request.auth.id != \"\" || @request.auth.collectionName = \"users\"";
  collection.deleteRule = "@request.auth.collectionName = \"users\"";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.listRule = "@request.auth.id != \"\"";
  collection.viewRule = "@request.auth.id != \"\"";
  collection.createRule = "";
  collection.updateRule = "userId = @request.auth.id";
  collection.deleteRule = "@request.auth.collectionName = \"users\"";
  return app.save(collection);
})
