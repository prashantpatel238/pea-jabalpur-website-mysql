/// <reference path="../pb_data/types.d.ts" />
cronAdd('anniversary-notifications', '0 8 * * *', function() {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Query all approved married members with marriage date
    const marriedMembers = $app.findRecordsByFilter('members', 'approval_status="approved" && marital_status="married" && marriage_date!=""', '-1', '0');

    // Find members with anniversaries today
    const anniversaryMembers = [];
    for (let i = 0; i < marriedMembers.length; i++) {
      const member = marriedMembers[i];
      const marriageDate = member.get('marriage_date');
      
      if (marriageDate && marriageDate !== '') {
        const annDate = new Date(marriageDate);
        const annMonth = annDate.getMonth() + 1;
        const annDay = annDate.getDate();
        
        if (annMonth === todayMonth && annDay === todayDay) {
          anniversaryMembers.push(member);
        }
      }
    }

    // If there are anniversary members, notify all approved members
    if (anniversaryMembers.length > 0) {
      const allApprovedMembers = $app.findRecordsByFilter('members', 'approval_status="approved"', '-1', '0');
      
      for (let i = 0; i < anniversaryMembers.length; i++) {
        const anniversaryMember = anniversaryMembers[i];
        const memberName = anniversaryMember.get('name') || 'Member';
        const spouseName = anniversaryMember.get('spouse_name') || 'their spouse';
        
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
                subject: '💍 ' + memberName + '\'s Marriage Anniversary Today!',
                html: '<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">' +
                  '<div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">' +
                  '<div style="text-align: center; margin-bottom: 20px;">' +
                  '<h2 style="color: #2c3e50; margin: 0;">💍 Anniversary Celebration</h2>' +
                  '</div>' +
                  '<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">' +
                  '<p style="margin: 0; font-size: 16px;"><strong>Dear Member,</strong></p>' +
                  '<p style="margin: 10px 0 0 0;">Today is a special day! Our esteemed colleague <strong>' + memberName + '</strong> and <strong>' + spouseName + '</strong> are celebrating their marriage anniversary.</p>' +
                  '</div>' +
                  '<div style="text-align: center; padding: 20px; background-color: #ffe6f0; border-radius: 5px; margin-bottom: 20px;">' +
                  '<p style="margin: 0; font-size: 18px;">💕 Let\'s join in wishing them a lifetime of love and happiness! 💕</p>' +
                  '</div>' +
                  '<div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #666;">' +
                  '<p style="margin: 0;"><strong>Professional Engineers Association, Jabalpur</strong></p>' +
                  '<p style="margin: 5px 0 0 0;">Advancing the Engineering Profession</p>' +
                  '</div>' +
                  '</div>' +
                  '</body></html>'
              });
              
              $app.newMailClient().send(message);
              console.log('Anniversary notification sent to ' + recipientEmail + ' for ' + memberName);
            } catch (emailError) {
              console.error('Error sending anniversary email to ' + recipientEmail + ': ' + emailError.message);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in anniversary-notifications cron job: ' + error.message);
  }
});