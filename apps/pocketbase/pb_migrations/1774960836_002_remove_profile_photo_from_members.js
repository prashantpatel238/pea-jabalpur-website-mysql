/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("profile_photo");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new FileField({
    name: "profile_photo",
    required: false,
    maxSelect: 1,
    maxSize: 20971520
  }));
  return app.save(collection);
})
