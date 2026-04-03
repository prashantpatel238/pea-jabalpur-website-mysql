/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");

  const record0 = new Record(collection);
    const record0_user_idLookup = app.findFirstRecordByFilter("users", "email='member@peajbalpur.com'");
    if (!record0_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='member@peajbalpur.com'\""); }
    record0.set("user_id", record0_user_idLookup.id);
    record0.set("full_name", "Rajesh Kumar");
    record0.set("email", "member@peajbalpur.com");
    record0.set("mobile_number", "9876543210");
    record0.set("gender", "Male");
    record0.set("date_of_birth", "1990-05-15");
    record0.set("status", "approved");
    record0.set("approval_date", "2026-03-30");
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
    const record1_user_idLookup = app.findFirstRecordByFilter("users", "email='pending@peajbalpur.com'");
    if (!record1_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='pending@peajbalpur.com'\""); }
    record1.set("user_id", record1_user_idLookup.id);
    record1.set("full_name", "Priya Singh");
    record1.set("email", "pending@peajbalpur.com");
    record1.set("mobile_number", "9876543211");
    record1.set("gender", "Female");
    record1.set("date_of_birth", "1992-08-20");
    record1.set("status", "pending");
  try {
    app.save(record1);
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
