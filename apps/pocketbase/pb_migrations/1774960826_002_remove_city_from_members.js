/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("city");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new TextField({
    name: "city",
    required: false
  }));
  return app.save(collection);
})
