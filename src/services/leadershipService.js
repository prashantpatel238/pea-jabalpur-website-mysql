const { getLeadershipMembers: fetchLeadershipMembers } = require("../repositories/publicMemberRepository");

async function getLeadershipMembers(options = {}) {
  return fetchLeadershipMembers(options);
}

module.exports = {
  getLeadershipMembers
};
