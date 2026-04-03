/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.fields.removeByName("email_unique");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("members");
  collection.fields.add(new EmailField({
    name: "email_unique"
  }));
  return app.save(collection);
})
