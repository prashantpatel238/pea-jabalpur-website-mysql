/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("notices");

  const record0 = new Record(collection);
    record0.set("title", "Upcoming Birthday - Rajesh Kumar");
    record0.set("notice_type", "birthday");
    record0.set("notice_date", "2026-04-15");
    record0.set("is_active", true);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("title", "Upcoming Birthday - Priya Singh");
    record1.set("notice_type", "birthday");
    record1.set("notice_date", "2026-04-20");
    record1.set("is_active", true);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("title", "Annual General Meeting");
    record2.set("notice_type", "announcement");
    record2.set("notice_date", "2026-04-10");
    record2.set("description", "Join us for our annual general meeting");
    record2.set("is_active", true);
  try {
    app.save(record2);
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
