/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("important_members");

  const existing = collection.fields.getByName("approval_status");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("approval_status"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "approval_status",
    required: true,
    values: ["pending", "approved", "rejected"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("important_members");
  collection.fields.removeByName("approval_status");
  return app.save(collection);
})
