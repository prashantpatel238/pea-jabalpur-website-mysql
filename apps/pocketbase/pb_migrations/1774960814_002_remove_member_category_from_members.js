/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("member_category");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new SelectField({
    name: "member_category",
    required: false,
    values: ["President", "Vice President", "Secretary", "Joint Secretary", "Treasurer", "Media Prabhari", "Core Committee Member", "General Member"]
  }));
  return app.save(collection);
})
