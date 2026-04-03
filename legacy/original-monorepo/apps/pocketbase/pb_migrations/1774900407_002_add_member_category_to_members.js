/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");

  const existing = collection.fields.getByName("member_category");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("member_category"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "member_category",
    values: ["General Member", "Core Committee Member", "Leadership"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("member_category");
  return app.save(collection);
})
