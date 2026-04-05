const { query } = require("../db/mysql");

async function generateMemberId() {
  const rows = await query(
    `SELECT COALESCE(MAX(CAST(SUBSTRING(member_id, 5) AS UNSIGNED)), 0) AS max_sequence
     FROM members
     WHERE member_id IS NOT NULL
       AND member_id LIKE 'PEA-%'`
  );

  const nextSequence = Number(rows[0]?.max_sequence || 0) + 1;
  return `PEA-${String(nextSequence).padStart(4, "0")}`;
}

module.exports = {
  generateMemberId
};
