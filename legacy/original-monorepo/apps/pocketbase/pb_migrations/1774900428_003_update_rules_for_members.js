/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.listRule = "@request.auth.id != '' && (status = 'approved' || @request.auth.role = 'admin' || @request.auth.role = 'member_manager')";
  collection.viewRule = "@request.auth.id = user_id || @request.auth.role = 'admin' || @request.auth.role = 'member_manager'";
  collection.createRule = "";
  collection.updateRule = "@request.auth.id = user_id || @request.auth.role = 'admin'";
  collection.deleteRule = "@request.auth.role = 'admin'";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("members");
  collection.listRule = "@request.auth.id != '' && (status = 'approved' || @request.auth.role = 'admin' || @request.auth.role = 'member_manager')";
  collection.viewRule = "@request.auth.id = user_id || @request.auth.role = 'admin' || @request.auth.role = 'member_manager'";
  collection.createRule = "";
  collection.updateRule = "@request.auth.id = user_id || @request.auth.role = 'admin'";
  collection.deleteRule = "@request.auth.role = 'admin'";
  return app.save(collection);
})
