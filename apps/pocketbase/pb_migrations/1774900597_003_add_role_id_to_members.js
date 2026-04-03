/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const rolesCollection = app.findCollectionByNameOrId("roles");
  const collection = app.findCollectionByNameOrId("members");

  const existing = collection.fields.getByName("role_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("role_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "role_id",
    required: false,
    collectionId: rolesCollection.id,
    maxSelect: 1
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("role_id");
  return app.save(collection);
})
