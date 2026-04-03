/// <reference path="../pb_data/types.d.ts" />
cronAdd('birthday-notifications', '0 8 * * *', function() {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Query all approved members
    const approvedMembers = $app.findRecordsByFilter('members', 'approval_status="approved"', '-1', '0');

    // Find members with birthdays today
    const birthdayMembers = [];
    for (let i = 0; i < approvedMembers.length; i++) {
      const member = approvedMembers[i];
      const dateOfBirth = member.get('date_of_birth');
      
      if (dateOfBirth && dateOfBirth !== '') {
        const birthDate = new Date(dateOfBirth);
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();
        
        if (birthMonth === todayMonth && birthDay === todayDay) {
          birthdayMembers.push(member);
        }
      }
    }

    // If there are birthday members, notify all approved members
    if (birthdayMembers.length > 0) {
      const allApprovedMembers = $app.findRecordsByFilter('members', 'approval_status="approved"', '-1', '0');
      
      for (let i = 0; i < birthdayMembers.length; i++) {
        const birthdayMember = birthdayMembers[i];
        const memberName = birthdayMember.get('name') || 'Member';
        const memberCategory = birthdayMember.get('category') || 'Professional Engineer';
        
        for (let j = 0; j < allApprovedMembers.length; j++) {
          const recipient = allApprovedMembers[j];
          const recipientEmail = recipient.get('email');
          
          if (recipientEmail && recipientEmail !== '') {
            try {
              const message = new MailerMessage({
                from: {
                  address: $app.settings().meta.senderAddress,
                  name: 'PEA Jabalpur'
                },
                to: [{ address: recipientEmail }],
                subject: '🎂 ' + memberName + '\'s Birthday Today!',
                html: '<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">' +
                  '<div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">' +
                  '<div style="text-align: center; margin-bottom: 20px;">' +
                  '<h2 style="color: #2c3e50; margin: 0;">🎂 Birthday Celebration</h2>' +
                  '</div>' +
                  '<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">' +
                  '<p style="margin: 0; font-size: 16px;"><strong>Dear Member,</strong></p>' +
                  '<p style="margin: 10px 0 0 0;">Today is a special day! Our esteemed colleague <strong>' + memberName + '</strong> (' + memberCategory + ') is celebrating their birthday.</p>' +
                  '</div>' +
                  '<div style="text-align: center; padding: 20px; background-color: #fff3cd; border-radius: 5px; margin-bottom: 20px;">' +
                  '<p style="margin: 0; font-size: 18px;">🎉 Let\'s join in wishing them a wonderful year ahead! 🎉</p>' +
                  '</div>' +
                  '<div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #666;">' +
                  '<p style="margin: 0;"><strong>Professional Engineers Association, Jabalpur</strong></p>' +
                  '<p style="margin: 5px 0 0 0;">Advancing the Engineering Profession</p>' +
                  '</div>' +
                  '</div>' +
                  '</body></html>'
              });
              
              $app.newMailClient().send(message);
              console.log('Birthday notification sent to ' + recipientEmail + ' for ' + memberName);
            } catch (emailError) {
              console.error('Error sending birthday email to ' + recipientEmail + ': ' + emailError.message);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in birthday-notifications cron job: ' + error.message);
  }
});