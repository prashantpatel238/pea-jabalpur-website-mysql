function formatDisplayDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function buildDirectoryMember(member) {
  return {
    id: member._id.toString(),
    full_name: member.full_name,
    role: member.role,
    city: member.show_city_in_directory ? member.city : "",
    profession: member.show_profession_in_directory ? member.profession : "",
    email: member.show_email_in_directory ? member.email : "",
    phone: member.show_mobile_in_directory ? member.phone : "",
    photo: member.show_photo_in_directory && member.photo ? member.photo : "/assets/images/default-avatar.svg",
    member_id: member.member_id || "",
    join_date: formatDisplayDate(member.join_date)
  };
}

function buildImportantMember(member) {
  return {
    id: member._id.toString(),
    full_name: member.full_name,
    role: member.role,
    leadership_title: member.leadership_title || member.role,
    city: member.show_city_in_directory ? member.city : "",
    profession: member.show_profession_in_directory ? member.profession : "",
    email: member.show_email_in_directory ? member.email : "",
    phone: member.show_mobile_in_directory ? member.phone : "",
    photo: member.show_photo_in_directory && member.photo ? member.photo : "/assets/images/default-avatar.svg"
  };
}

module.exports = {
  buildDirectoryMember,
  buildImportantMember,
  formatDisplayDate
};
