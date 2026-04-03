/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("directory_config");

  const record0 = new Record(collection);
    record0.set("show_profile_photo", true);
    record0.set("show_email", true);
    record0.set("show_phone", true);
    record0.set("show_date_of_birth", false);
    record0.set("show_address", false);
    record0.set("show_profession_designation", true);
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
