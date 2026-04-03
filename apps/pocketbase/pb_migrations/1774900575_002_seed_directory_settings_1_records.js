/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("directory_settings");

  const record0 = new Record(collection);
    record0.set("visible_fields", ["name", "email", "phone", "profession", "address"]);
    record0.set("grouping_by", "category");
    record0.set("show_leadership_section", true);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
