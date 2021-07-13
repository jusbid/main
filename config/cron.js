module.exports.cron = {

    MissedSLAService: {
        schedule: '*/120 * * * * *',
        onTick: function () {
            functions.Set_Missed_Bids();
            functions.Set_User_Missed_Bids();
           // sails.log('Running Missed SLA function CRON service');
        }
    },


    RemoveOlderNotification: {
        schedule: '00 00 12 * * 0-6',
        onTick: function () {
            functions.RemoveOlderNotification();
            //sails.log('Running Missed SLA function CRON service');
        }
    },

    SendFirstReminder: {
        schedule: '*/90 * * * * *',
        onTick: function () {
            functions.Send_Bid_Notification_Hotelier();
            //sails.log('Running Missed SLA function CRON service');
        }
    },

    SendSecondReminder: {
        schedule: '*/80 * * * * *',
        onTick: function () {
            functions.Send_Bid_Notification_Hotelier2();
            //sails.log('Running Missed SLA function CRON service 2');
        }
    },

    ScheduleBackup: {
        schedule: '59 23 * * *',
        onTick: function () {
            functions.Backup_MongoDB();
            //sails.log('Running Backup Service');
        }
        
    },

    Set_Past_Bookings: {
        schedule: '*/10 * * * * *',
        onTick: function () {
            functions.Set_Past_Bookings();
            functions.Set_Current_Bookings();
            //sails.log('Running Past/Current Service');
        }
    },

    Remove_Old_Notifications: {
        schedule: '*/20 * * * * *',
        onTick: function () {
            functions.RemoveOlderNotificationByTime();
            functions.RemoveOlderNotificationByStatus();
        }
    },

    // SendPush_Single_Test_1:{
    //     schedule: '*/3 * * * * *',
    //     onTick: function () {
    //         NotificationsFunctions.SendPush_Single_Test();
    //     }
    // }

    

    // SendPush_Single: {
    //     schedule: '*/5 * * * * *',
    //     onTick: function () {
    //         NotificationsFunctions.Send_Single_Hotelier_Test('test new hotelier notification', 'test new hotelier notification', 'Hol48');
    //         sails.log('Running Notification');
    //     }
    // },


    


    
    

};