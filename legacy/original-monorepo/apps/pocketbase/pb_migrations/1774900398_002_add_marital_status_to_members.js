/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");

  const existing = collection.fields.getByName("marital_status");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("marital_status"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "marital_status",
    values: ["single", "married", "divorced", "widowed"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("marital_status");
  return app.save(collection);
})
