/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("important_members");

  const record0 = new Record(collection);
    record0.set("name", "Er. Anil Singour");
    record0.set("role", "President");
    record0.set("phone", "9425159834");
    record0.set("sort_order", 1);
    record0.set("is_important_member", true);
    record0.set("approval_status", "approved");
    record0.set("show_photo", true);
    record0.set("show_name", true);
    record0.set("show_role", true);
    record0.set("show_phone", true);
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
    record1.set("name", "Er. Madhav Namdeo");
    record1.set("role", "Vice President");
    record1.set("phone", "9827357474");
    record1.set("sort_order", 2);
    record1.set("is_important_member", true);
    record1.set("approval_status", "approved");
    record1.set("show_photo", true);
    record1.set("show_name", true);
    record1.set("show_role", true);
    record1.set("show_phone", true);
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
    record2.set("name", "Er. K.R. Bramhe");
    record2.set("role", "Vice President");
    record2.set("phone", "9893015038");
    record2.set("sort_order", 3);
    record2.set("is_important_member", true);
    record2.set("approval_status", "approved");
    record2.set("show_photo", true);
    record2.set("show_name", true);
    record2.set("show_role", true);
    record2.set("show_phone", true);
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
    record3.set("name", "Er. Neelesh Soni");
    record3.set("role", "Secretary");
    record3.set("phone", "9425412820");
    record3.set("sort_order", 4);
    record3.set("is_important_member", true);
    record3.set("approval_status", "approved");
    record3.set("show_photo", true);
    record3.set("show_name", true);
    record3.set("show_role", true);
    record3.set("show_phone", true);
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
    record4.set("name", "Er. Deepak Namdeo");
    record4.set("role", "Joint Secretary");
    record4.set("sort_order", 5);
    record4.set("is_important_member", true);
    record4.set("approval_status", "approved");
    record4.set("show_photo", true);
    record4.set("show_name", true);
    record4.set("show_role", true);
    record4.set("show_phone", true);
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
    record5.set("name", "Er. Ravi Chourasia");
    record5.set("role", "Treasurer");
    record5.set("sort_order", 6);
    record5.set("is_important_member", true);
    record5.set("approval_status", "approved");
    record5.set("show_photo", true);
    record5.set("show_name", true);
    record5.set("show_role", true);
    record5.set("show_phone", true);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("name", "Er. Nitin Dubey");
    record6.set("role", "Media Prabhari");
    record6.set("sort_order", 7);
    record6.set("is_important_member", true);
    record6.set("approval_status", "approved");
    record6.set("show_photo", true);
    record6.set("show_name", true);
    record6.set("show_role", true);
    record6.set("show_phone", true);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("name", "Er. Bhupendra Dubey");
    record7.set("role", "Core Committee Member");
    record7.set("sort_order", 8);
    record7.set("is_important_member", true);
    record7.set("approval_status", "approved");
    record7.set("show_photo", true);
    record7.set("show_name", true);
    record7.set("show_role", true);
    record7.set("show_phone", true);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("name", "Er. Ramnarayan Senger");
    record8.set("role", "Core Committee Member");
    record8.set("sort_order", 9);
    record8.set("is_important_member", true);
    record8.set("approval_status", "approved");
    record8.set("show_photo", true);
    record8.set("show_name", true);
    record8.set("show_role", true);
    record8.set("show_phone", true);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("name", "Er. Ritesh Ravani");
    record9.set("role", "Core Committee Member");
    record9.set("sort_order", 10);
    record9.set("is_important_member", true);
    record9.set("approval_status", "approved");
    record9.set("show_photo", true);
    record9.set("show_name", true);
    record9.set("show_role", true);
    record9.set("show_phone", true);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("name", "Er. Arvind Bain");
    record10.set("role", "Core Committee Member");
    record10.set("sort_order", 11);
    record10.set("is_important_member", true);
    record10.set("approval_status", "approved");
    record10.set("show_photo", true);
    record10.set("show_name", true);
    record10.set("show_role", true);
    record10.set("show_phone", true);
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("name", "Er. Satish Dixit");
    record11.set("role", "Core Committee Member");
    record11.set("sort_order", 12);
    record11.set("is_important_member", true);
    record11.set("approval_status", "approved");
    record11.set("show_photo", true);
    record11.set("show_name", true);
    record11.set("show_role", true);
    record11.set("show_phone", true);
  try {
    app.save(record11);
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
