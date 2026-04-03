/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("important_members");

  const existing = collection.fields.getByName("photo");
  if (existing) {
    if (existing.type === "file") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("photo"); // exists with wrong type, remove first
  }

  collection.fields.add(new FileField({
    name: "photo",
    required: false,
    maxSelect: 1,
    maxSize: 20971520
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("important_members");
  collection.fields.removeByName("photo");
  return app.save(collection);
})
