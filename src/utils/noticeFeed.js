function getNextOccurrence(dateValue) {
  if (!dateValue) {
    return null;
  }

  const source = new Date(dateValue);
  const now = new Date();
  const occurrence = new Date(now.getFullYear(), source.getMonth(), source.getDate());

  if (occurrence < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    occurrence.setFullYear(now.getFullYear() + 1);
  }

  return occurrence;
}

function getDaysUntil(dateValue) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = dateValue.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function buildMemberCelebrationNotices(members) {
  const items = [];

  members.forEach((member) => {
    const memberIdentifier = member.id ?? member._id?.toString() ?? member.member_id ?? member.email ?? member.full_name;

    if (member.dob) {
      const nextBirthday = getNextOccurrence(member.dob);
      const daysUntil = getDaysUntil(nextBirthday);

      if (daysUntil >= 0 && daysUntil <= 30) {
        items.push({
          id: `birthday-${memberIdentifier}`,
          title: `${member.full_name}'s Birthday`,
          content: `Celebrating ${member.full_name} on ${nextBirthday.toLocaleDateString("en-IN", { day: "2-digit", month: "long" })}.`,
          type: "birthday",
          event_date: nextBirthday,
          sort_order: daysUntil
        });
      }
    }

    if (member.marriage_date) {
      const nextAnniversary = getNextOccurrence(member.marriage_date);
      const daysUntil = getDaysUntil(nextAnniversary);

      if (daysUntil >= 0 && daysUntil <= 30) {
        items.push({
          id: `anniversary-${memberIdentifier}`,
          title: `${member.full_name}'s Anniversary`,
          content: `Wishing ${member.full_name}${member.spouse_name ? ` and ${member.spouse_name}` : ""} a happy anniversary on ${nextAnniversary.toLocaleDateString("en-IN", { day: "2-digit", month: "long" })}.`,
          type: "anniversary",
          event_date: nextAnniversary,
          sort_order: daysUntil
        });
      }
    }
  });

  return items;
}

module.exports = {
  buildMemberCelebrationNotices
};
