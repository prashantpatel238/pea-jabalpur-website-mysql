const Counter = require("../models/Counter");

async function generateMemberId() {
  const counter = await Counter.findOneAndUpdate(
    { key: "member_id" },
    { $inc: { value: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  return `PEA-${String(counter.value).padStart(4, "0")}`;
}

module.exports = {
  generateMemberId
};
