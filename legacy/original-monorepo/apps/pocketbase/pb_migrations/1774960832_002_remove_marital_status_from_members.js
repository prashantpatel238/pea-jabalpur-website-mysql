/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("marital_status");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new SelectField({
    name: "marital_status",
    required: false,
    values: ["Single", "Married", "Divorced", "Widowed"]
  }));
  return app.save(collection);
})
