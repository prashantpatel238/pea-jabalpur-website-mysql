/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("members");

  const record0 = new Record(collection);
    record0.set("full_name", "Er. Anil Singour");
    record0.set("email", "anil.singour@pea.org");
    record0.set("mobile_number", "9425159834");
    record0.set("gender", "Male");
    record0.set("date_of_birth", "1970-01-01");
    record0.set("member_category", "President");
    record0.set("role", "President");
    record0.set("phone_number", "9425159834");
    record0.set("phone", "9425159834");
    record0.set("approval_status", "approved");
    record0.set("directory_visible", true);
    record0.set("status", "approved");
    const record0_user_idLookup = app.findFirstRecordByFilter("users", "email='anil.singour@pea.org'");
    if (!record0_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='anil.singour@pea.org'\""); }
    record0.set("user_id", record0_user_idLookup.id);
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
    record1.set("full_name", "Er. Madhav Namdeo");
    record1.set("email", "madhav.namdeo@pea.org");
    record1.set("mobile_number", "9827357474");
    record1.set("gender", "Male");
    record1.set("date_of_birth", "1970-01-01");
    record1.set("member_category", "Vice President");
    record1.set("role", "Vice President");
    record1.set("phone_number", "9827357474");
    record1.set("phone", "9827357474");
    record1.set("approval_status", "approved");
    record1.set("directory_visible", true);
    record1.set("status", "approved");
    const record1_user_idLookup = app.findFirstRecordByFilter("users", "email='madhav.namdeo@pea.org'");
    if (!record1_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='madhav.namdeo@pea.org'\""); }
    record1.set("user_id", record1_user_idLookup.id);
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
    record2.set("full_name", "Er. K.R. Bramhe");
    record2.set("email", "kr.bramhe@pea.org");
    record2.set("mobile_number", "9893015038");
    record2.set("gender", "Male");
    record2.set("date_of_birth", "1970-01-01");
    record2.set("member_category", "Vice President");
    record2.set("role", "Vice President");
    record2.set("phone_number", "9893015038");
    record2.set("phone", "9893015038");
    record2.set("approval_status", "approved");
    record2.set("directory_visible", true);
    record2.set("status", "approved");
    const record2_user_idLookup = app.findFirstRecordByFilter("users", "email='kr.bramhe@pea.org'");
    if (!record2_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='kr.bramhe@pea.org'\""); }
    record2.set("user_id", record2_user_idLookup.id);
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
    record3.set("full_name", "Er. Neelesh Soni");
    record3.set("email", "neelesh.soni@pea.org");
    record3.set("mobile_number", "9425412820");
    record3.set("gender", "Male");
    record3.set("date_of_birth", "1970-01-01");
    record3.set("member_category", "Secretary");
    record3.set("role", "Secretary");
    record3.set("phone_number", "9425412820");
    record3.set("phone", "9425412820");
    record3.set("approval_status", "approved");
    record3.set("directory_visible", true);
    record3.set("status", "approved");
    const record3_user_idLookup = app.findFirstRecordByFilter("users", "email='neelesh.soni@pea.org'");
    if (!record3_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='neelesh.soni@pea.org'\""); }
    record3.set("user_id", record3_user_idLookup.id);
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
    record4.set("full_name", "Er. Deepak Namdeo");
    record4.set("email", "deepak.namdeo@pea.org");
    record4.set("mobile_number", "9000000001");
    record4.set("gender", "Male");
    record4.set("date_of_birth", "1970-01-01");
    record4.set("member_category", "Joint Secretary");
    record4.set("role", "Joint Secretary");
    record4.set("approval_status", "approved");
    record4.set("directory_visible", true);
    record4.set("status", "approved");
    const record4_user_idLookup = app.findFirstRecordByFilter("users", "email='deepak.namdeo@pea.org'");
    if (!record4_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='deepak.namdeo@pea.org'\""); }
    record4.set("user_id", record4_user_idLookup.id);
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
    record5.set("full_name", "Er. Ravi Chourasia");
    record5.set("email", "ravi.chourasia@pea.org");
    record5.set("mobile_number", "9000000002");
    record5.set("gender", "Male");
    record5.set("date_of_birth", "1970-01-01");
    record5.set("member_category", "Treasurer");
    record5.set("role", "Treasurer");
    record5.set("approval_status", "approved");
    record5.set("directory_visible", true);
    record5.set("status", "approved");
    const record5_user_idLookup = app.findFirstRecordByFilter("users", "email='ravi.chourasia@pea.org'");
    if (!record5_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='ravi.chourasia@pea.org'\""); }
    record5.set("user_id", record5_user_idLookup.id);
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
    record6.set("full_name", "Er. Nitin Dubey");
    record6.set("email", "nitin.dubey@pea.org");
    record6.set("mobile_number", "9000000003");
    record6.set("gender", "Male");
    record6.set("date_of_birth", "1970-01-01");
    record6.set("member_category", "Media Prabhari");
    record6.set("role", "Media Prabhari");
    record6.set("approval_status", "approved");
    record6.set("directory_visible", true);
    record6.set("status", "approved");
    const record6_user_idLookup = app.findFirstRecordByFilter("users", "email='nitin.dubey@pea.org'");
    if (!record6_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='nitin.dubey@pea.org'\""); }
    record6.set("user_id", record6_user_idLookup.id);
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
    record7.set("full_name", "Er. Bhupendra Dubey");
    record7.set("email", "bhupendra.dubey@pea.org");
    record7.set("mobile_number", "9000000004");
    record7.set("gender", "Male");
    record7.set("date_of_birth", "1970-01-01");
    record7.set("member_category", "Core Committee Member");
    record7.set("role", "Core Committee Member");
    record7.set("approval_status", "approved");
    record7.set("directory_visible", true);
    record7.set("status", "approved");
    const record7_user_idLookup = app.findFirstRecordByFilter("users", "email='bhupendra.dubey@pea.org'");
    if (!record7_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='bhupendra.dubey@pea.org'\""); }
    record7.set("user_id", record7_user_idLookup.id);
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
    record8.set("full_name", "Er. Ramnarayan Senger");
    record8.set("email", "ramnarayan.senger@pea.org");
    record8.set("mobile_number", "9000000005");
    record8.set("gender", "Male");
    record8.set("date_of_birth", "1970-01-01");
    record8.set("member_category", "Core Committee Member");
    record8.set("role", "Core Committee Member");
    record8.set("approval_status", "approved");
    record8.set("directory_visible", true);
    record8.set("status", "approved");
    const record8_user_idLookup = app.findFirstRecordByFilter("users", "email='ramnarayan.senger@pea.org'");
    if (!record8_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='ramnarayan.senger@pea.org'\""); }
    record8.set("user_id", record8_user_idLookup.id);
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
    record9.set("full_name", "Er. Ritesh Ravani");
    record9.set("email", "ritesh.ravani@pea.org");
    record9.set("mobile_number", "9000000006");
    record9.set("gender", "Male");
    record9.set("date_of_birth", "1970-01-01");
    record9.set("member_category", "Core Committee Member");
    record9.set("role", "Core Committee Member");
    record9.set("approval_status", "approved");
    record9.set("directory_visible", true);
    record9.set("status", "approved");
    const record9_user_idLookup = app.findFirstRecordByFilter("users", "email='ritesh.ravani@pea.org'");
    if (!record9_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='ritesh.ravani@pea.org'\""); }
    record9.set("user_id", record9_user_idLookup.id);
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
    record10.set("full_name", "Er. Arvind Bain");
    record10.set("email", "arvind.bain@pea.org");
    record10.set("mobile_number", "9000000007");
    record10.set("gender", "Male");
    record10.set("date_of_birth", "1970-01-01");
    record10.set("member_category", "Core Committee Member");
    record10.set("role", "Core Committee Member");
    record10.set("approval_status", "approved");
    record10.set("directory_visible", true);
    record10.set("status", "approved");
    const record10_user_idLookup = app.findFirstRecordByFilter("users", "email='arvind.bain@pea.org'");
    if (!record10_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='arvind.bain@pea.org'\""); }
    record10.set("user_id", record10_user_idLookup.id);
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
    record11.set("full_name", "Er. Satish Dixit");
    record11.set("email", "satish.dixit@pea.org");
    record11.set("mobile_number", "9000000008");
    record11.set("gender", "Male");
    record11.set("date_of_birth", "1970-01-01");
    record11.set("member_category", "Core Committee Member");
    record11.set("role", "Core Committee Member");
    record11.set("approval_status", "approved");
    record11.set("directory_visible", true);
    record11.set("status", "approved");
    const record11_user_idLookup = app.findFirstRecordByFilter("users", "email='satish.dixit@pea.org'");
    if (!record11_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='satish.dixit@pea.org'\""); }
    record11.set("user_id", record11_user_idLookup.id);
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
