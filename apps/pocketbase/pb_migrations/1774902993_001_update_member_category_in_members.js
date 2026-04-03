/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  const field = collection.fields.getByName("member_category");
  field.values = ["President", "Vice President", "Secretary", "Joint Secretary", "Treasurer", "Media Prabhari", "Core Committee Member", "General Member"];
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  const field = collection.fields.getByName("member_category");
  field.values = ["General Member", "Core Committee Member", "Leadership"];
  return app.save(collection);
})
