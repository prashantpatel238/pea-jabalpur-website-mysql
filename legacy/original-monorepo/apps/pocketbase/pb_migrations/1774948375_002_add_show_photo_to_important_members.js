/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("important_members");

  const existing = collection.fields.getByName("show_photo");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("show_photo"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "show_photo",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("important_members");
  collection.fields.removeByName("show_photo");
  return app.save(collection);
})
