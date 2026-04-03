/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");

  const record0 = new Record(collection);
    record0.set("name", "Test Member");
    record0.set("email", "test@pea-jabalpur.org");
    record0.set("phone", "9999999999");
    record0.set("member_category", "General Member");
    record0.set("role", "member");
    record0.set("approval_status", "approved");
    record0.set("qualification", "B.Tech");
    record0.set("experience", "5 years");
    record0.set("company", "Test Company");
    record0.set("designation", "Engineer");
    record0.set("address", "Test Address");
    record0.set("city", "Jabalpur");
    record0.set("state", "Madhya Pradesh");
    record0.set("pincode", "482001");
    record0.set("marital_status", "Single");
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
