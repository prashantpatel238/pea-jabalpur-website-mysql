/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("userId");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new TextField({
    name: "userId",
    required: false
  }));
  return app.save(collection);
})
