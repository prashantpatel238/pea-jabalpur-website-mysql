/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    const notifyMembers = e.record.get('notify_members');
    
    if (notifyMembers === true) {
      const eventName = e.record.get('name') || 'Event';
      const eventDate = e.record.get('event_date') || '';
      const eventTime = e.record.get('event_time') || '';
      const eventVenue = e.record.get('venue') || '';
      const eventDescription = e.record.get('description') || '';
      
      // Query all approved members
      const approvedMembers = $app.findRecordsByFilter('members', 'approval_status="approved"', '-1', '0');
      
      for (let i = 0; i < approvedMembers.length; i++) {
        const member = approvedMembers[i];
        const recipientEmail = member.get('email');
        
        if (recipientEmail && recipientEmail !== '') {
          try {
            const message = new MailerMessage({
              from: {
                address: $app.settings().meta.senderAddress,
                name: 'PEA Jabalpur'
              },
              to: [{ address: recipientEmail }],
              subject: eventName + ' - ' + eventDate,
              html: '<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">' +
                '<div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">' +
                '<div style="text-align: center; margin-bottom: 20px;">' +
                '<h2 style="color: #2c3e50; margin: 0;">📢 Event Notification</h2>' +
                '</div>' +
                '<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">' +
                '<p style="margin: 0; font-size: 16px;"><strong>Dear Member,</strong></p>' +
                '<p style="margin: 10px 0 0 0;">We are pleased to invite you to an upcoming event organized by the Professional Engineers Association, Jabalpur.</p>' +
                '</div>' +
                '<div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">' +
                '<p style="margin: 0 0 10px 0;"><strong style="color: #2c3e50;">📅 Event Details:</strong></p>' +
                '<p style="margin: 5px 0;"><strong>Event Name:</strong> ' + eventName + '</p>' +
                '<p style="margin: 5px 0;"><strong>Date:</strong> ' + eventDate + '</p>' +
                '<p style="margin: 5px 0;"><strong>Time:</strong> ' + eventTime + '</p>' +
                '<p style="margin: 5px 0;"><strong>Venue:</strong> ' + eventVenue + '</p>' +
                '</div>' +
                '<div style="background-color: #f0f8f0; padding: 15px; border-radius: 5px; margin-bottom: 20px;">' +
                '<p style="margin: 0 0 10px 0;"><strong style="color: #2c3e50;">📝 Description:</strong></p>' +
                '<p style="margin: 0;">' + eventDescription + '</p>' +
                '</div>' +
                '<div style="text-align: center; padding: 15px; background-color: #fff3cd; border-radius: 5px; margin-bottom: 20px;">' +
                '<p style="margin: 0; font-size: 16px;"><strong>We look forward to your participation!</strong></p>' +
                '</div>' +
                '<div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #666;">' +
                '<p style="margin: 0;"><strong>Professional Engineers Association, Jabalpur</strong></p>' +
                '<p style="margin: 5px 0 0 0;">Advancing the Engineering Profession</p>' +
                '</div>' +
                '</div>' +
                '</body></html>'
            });
            
            $app.newMailClient().send(message);
            console.log('Event notification sent to ' + recipientEmail + ' for event: ' + eventName);
          } catch (emailError) {
            console.error('Error sending event email to ' + recipientEmail + ': ' + emailError.message);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in event-notifications hook: ' + error.message);
  }
  
  e.next();
}, 'events');