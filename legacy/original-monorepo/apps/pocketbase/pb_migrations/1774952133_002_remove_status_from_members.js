/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("status");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new SelectField({
    name: "status",
    required: true,
    values: ["approved", "pending", "denied"]
  }));
  return app.save(collection);
})
