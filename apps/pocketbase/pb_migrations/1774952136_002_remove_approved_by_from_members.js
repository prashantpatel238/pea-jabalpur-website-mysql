/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("approved_by");
  return app.save(collection);
}, (app) => {

  const _pb_users_auth_Collection = app.findCollectionByNameOrId("_pb_users_auth_");
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new RelationField({
    name: "approved_by",
    collectionId: _pb_users_auth_Collection.id
  }));
  return app.save(collection);
})
