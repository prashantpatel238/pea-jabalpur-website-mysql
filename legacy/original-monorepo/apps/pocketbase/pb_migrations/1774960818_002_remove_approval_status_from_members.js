/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("approval_status");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new SelectField({
    name: "approval_status",
    required: false,
    values: ["pending", "approved", "rejected"]
  }));
  return app.save(collection);
})
