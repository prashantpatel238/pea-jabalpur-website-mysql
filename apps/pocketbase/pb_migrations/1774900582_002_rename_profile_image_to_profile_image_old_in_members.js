/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  const field = collection.fields.getByName("profile_image");
  field.name = "profile_image_old";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  const field = collection.fields.getByName("profile_image_old");
  field.name = "profile_image";
  return app.save(collection);
})
