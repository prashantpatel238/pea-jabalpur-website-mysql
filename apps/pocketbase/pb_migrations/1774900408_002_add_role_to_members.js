/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");

  const existing = collection.fields.getByName("role");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("role"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "role",
    values: ["President", "Vice President", "Secretary", "Joint Secretary", "Treasurer", "Media Prabhari", "Core Committee Member", "General Member"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("role");
  return app.save(collection);
})
