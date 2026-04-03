/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("important_members");

  const record0 = new Record(collection);
    record0.set("name", "Eng. Rajesh Patel");
    record0.set("role", "President");
    record0.set("bio", "Experienced engineer with 20+ years in the field");
    record0.set("sort_order", 1);
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
    record1.set("name", "Eng. Priya Sharma");
    record1.set("role", "Secretary");
    record1.set("bio", "Dedicated professional committed to member services");
    record1.set("sort_order", 2);
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
    record2.set("name", "Eng. Arun Kumar");
    record2.set("role", "Core Member");
    record2.set("bio", "Technical expert in infrastructure development");
    record2.set("sort_order", 3);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("name", "Eng. Neha Gupta");
    record3.set("role", "Core Member");
    record3.set("bio", "Passionate about sustainable engineering practices");
    record3.set("sort_order", 4);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("name", "Eng. Vikram Singh");
    record4.set("role", "Core Member");
    record4.set("bio", "Leader in project management and innovation");
    record4.set("sort_order", 5);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("name", "Eng. Anjali Verma");
    record5.set("role", "Core Member");
    record5.set("bio", "Advocate for professional development and training");
    record5.set("sort_order", 6);
  try {
    app.save(record5);
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
