/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("notices");

  const existing = collection.fields.getByName("publish_date");
  if (existing) {
    if (existing.type === "date") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("publish_date"); // exists with wrong type, remove first
  }

  collection.fields.add(new DateField({
    name: "publish_date",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("notices");
  collection.fields.removeByName("publish_date");
  return app.save(collection);
})
