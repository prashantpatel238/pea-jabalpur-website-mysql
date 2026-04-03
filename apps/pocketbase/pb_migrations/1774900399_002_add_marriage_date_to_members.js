/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");

  const existing = collection.fields.getByName("marriage_date");
  if (existing) {
    if (existing.type === "date") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("marriage_date"); // exists with wrong type, remove first
  }

  collection.fields.add(new DateField({
    name: "marriage_date"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("marriage_date");
  return app.save(collection);
})
