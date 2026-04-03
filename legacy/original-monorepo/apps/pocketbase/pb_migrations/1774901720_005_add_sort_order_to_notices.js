/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("notices");

  const existing = collection.fields.getByName("sort_order");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("sort_order"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "sort_order",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("notices");
  collection.fields.removeByName("sort_order");
  return app.save(collection);
})
