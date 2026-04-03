/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("role");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new SelectField({
    name: "role",
    values: ["President", "Vice President", "Secretary", "Joint Secretary", "Treasurer", "Media Prabhari", "Core Committee Member", "General Member"]
  }));
  return app.save(collection);
})
