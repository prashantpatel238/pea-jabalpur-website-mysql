/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  const field = collection.fields.getByName("marital_status");
  field.values = ["Single", "Married", "Divorced", "Widowed"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  const field = collection.fields.getByName("marital_status");
  field.values = ["single", "married", "divorced", "widowed"];
  return app.save(collection);
})
