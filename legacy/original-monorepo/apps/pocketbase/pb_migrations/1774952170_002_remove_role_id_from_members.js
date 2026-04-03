/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("role_id");
  return app.save(collection);
}, (app) => {

  const pbc_7321599086Collection = app.findCollectionByNameOrId("pbc_7321599086");
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new RelationField({
    name: "role_id",
    collectionId: pbc_7321599086Collection.id
  }));
  return app.save(collection);
})
