module.exports.routes = {

  // ---------------------------------------------------****************API ROUTES***************----------------------------------------------------------------

  //-------------------ERP Controller Controller----------------------------------------------------------------
  'POST /erp-all-payments': { controller: 'ERPController', action: 'Get_All_Payments' },
  'POST /bookings-erp': { controller: 'ERPController', action: 'Get_All_Bookings_ERP' },
  'POST /upload-invoice': { controller: 'ERPController', action: 'Upload_Invoice' },
  'POST /hotel-invoice': { controller: 'ERPController', action: 'Hotel_Invoices' },
  'POST /save-hotelier-payment': { controller: 'ERPController', action: 'Save_Hotelier_Payments' },
  'POST /get-hotelier-payment': { controller: 'ERPController', action: 'Get_Hotelier_Payments' },
  'POST /save-balance-sheet-data': { controller: 'ERPController', action: 'Save_Balance_Sheet_Data' },
  'POST /get-agent-bookings': { controller: 'ERPController', action: 'Get_Agent_Bookings' },
  
  
  
  //-------------------ERPUser Controller Controller----------------------------------------------------------------
  'POST /erp-user': { controller: 'ERPUserController', action: 'Create_ERP_User' },
  'POST /create-update-branch': { controller: 'ERPUserController', action: 'Create_Update_Branch' },
  'POST /erp-user-login': { controller: 'ERPUserController', action: 'UserLogin' },
  'GET /branches': { controller: 'ERPUserController', action: 'Get_Branch' },
  'GET /erp-users': { controller: 'ERPUserController', action: 'Get_ERP_Users' },

  //-----------------------------------User Controller Basic Functionality Routes------------------------------------------
  'GET /create-restricted-user': { controller: 'UserController', action: 'CreateRestrictedUser' },
  'POST /create-user': { controller: 'UserController', action: 'CreateUser' },
  'POST /create-agent': { controller: 'UserController', action: 'CreateAgent' },
  'POST /create-agent-request': { controller: 'UserController', action: 'CreateAgentRequest' },
  'POST /create-front-user': { controller: 'UserController', action: 'CreateFrontUser' },
  'POST /user-login': { controller: 'LoginController', action: 'UserLogin' },
  'POST /front-user-login': { controller: 'LoginController', action: 'FrontUserLogin' },
  'POST /hotelier-login': { controller: 'LoginController', action: 'Hotelier_Login' },
  
  'POST /otp-login': { controller: 'LoginController', action: 'LoginWithOTP' },
  'POST /forgot-password': { controller: 'LoginController', action: 'ForgotPassword' },
  'POST /forgot-user-password': { controller: 'LoginController', action: 'ForgotUserPassword' },
  'POST /change-password': { controller: 'UserController', action: 'ChangePassword' },
  'POST /get-user-profile': { controller: 'UserController', action: 'GetUserProfile' },
  'POST /get-user-list': { controller: 'UserController', action: 'Get_UserList' },
  'POST /get-filtered-users': { controller: 'UserController', action: 'Get_Filtered_Users' },
  'POST /update-user-status': { controller: 'UserController', action: 'Update_User_Status' },
  'POST /delete-user': { controller: 'UserController', action: 'Delete_User' },
  'PUT /update-user-byid': { controller: 'UserController', action: 'UpdateUser' },
  'PUT /update-front-user-status': { controller: 'UserController', action: 'UpdateFrontUserStatus' },
  'POST /create-bdm': { controller: 'UserController', action: 'CreateBDMUser' },
  'POST /create-senior-bdm': { controller: 'UserController', action: 'Create_Senior_BDM_User' },
  'POST /get-seniorbdm-bdms': { controller: 'UserController', action: 'Get_Senior_BDM_BDMS' },
  'POST /update-user-password': { controller: 'UserController', action: 'Update_User_Password' },
  'POST /update-bank-details': { controller: 'UserController', action: 'Update_Bank_Details' },
  'POST /set-profile-img': { controller: 'UserController', action: 'Set_Profile_Img' },
  'POST /update-my-bdm': { controller: 'UserController', action: 'UpdateMy_BDM' },
  'POST /get-my-bde-app': { controller: 'UserController', action: 'Get_My_BDE' },
  'POST /get-bdm-bde-admin': { controller: 'UserController', action: 'Get_My_BDE_Admin' },
  
  'POST /restricted-delete-user': { controller: 'UserController', action: 'Restricted_Delete_User' },
  'POST /get-bde-travelagents': { controller: 'UserController', action: 'Get_TravelAgents_For_BDE' },
  'POST /search-bde-travelagents': { controller: 'UserController', action: 'Search_BDE_TravelAgents' },
  'POST /get-bdm-travelagents': { controller: 'UserController', action: 'Get_TravelAgents_For_BDM' },
  'POST /search-bdm-travelagents': { controller: 'UserController', action: 'Search_TravelAgents_For_BDM' },
  'POST /update-device-token': { controller: 'UserController', action: 'Update_User_Token' },
  'GET /update-column': { controller: 'UserController', action: 'Update_Column' },

  //-------------------System User Controller Functionality Routes-----------------------------------
  'POST /create-admin': { controller: 'SystemUserController', action: 'Create_Admin' },
  'POST /system-user': { controller: 'SystemUserController', action: 'Create_System_User' },
  'PUT /system-user': { controller: 'SystemUserController', action: 'Update_System_User' },
  'POST /get-system-users': { controller: 'SystemUserController', action: 'System_Users_List' },
  'POST /system-user-login': { controller: 'LoginController', action: 'System_User_Login' },
  'POST /get-users-for-admin': { controller: 'SystemUserController', action: 'Get_Users_Admin' },

  'POST /get-all-complaints-admin': { controller: 'SystemUserController', action: 'Get_All_Admin_Complaints' },
  'POST /get-rejected-bids-admin': { controller: 'SystemUserController', action: 'Get_Rejected_Bids_Admin' },
  'POST /get-all-bids-admin': { controller: 'SystemUserController', action: 'Get_All_Bids_Admin' },
  'POST /get-all-bookings-admin': { controller: 'SystemUserController', action: 'Get_All_Bookings_Admin' },
  'POST /system-user-dashboard-data': { controller: 'SystemUserController', action: 'Get_Dashboard_Counts_SystemUsers' },


  //-------------------BankDetails Controller Basic Functionality Routes-----------------------------------
  'POST /save-bank-details': { controller: 'BankDetailsController', action: 'Save_BankDetails' },
  'POST /get-bankdetail': { controller: 'BankDetailsController', action: 'Get_BankDetails' },
  'POST /remove-bankdetail': { controller: 'BankDetailsController', action: 'Remove_BankDetails' },

  //-------------------Hotel Controller Routing-------------------------------------------------------------
  'POST /onboard-hotel': { controller: 'HotelController', action: 'OnBoard_Hotel' },

  'POST /create-admin-hotel': { controller: 'HotelController', action: 'Create_Admin_Hotel' },

  'POST /create-hotel-rooms-hotelier': { controller: 'HotelController', action: 'CreateHotelRooms_Hotelier' },
  'POST /edit-hotel-rooms-hotelier': { controller: 'HotelController', action: 'EditHotelRooms_Hotelier' },
  'POST /remove-hotel-rooms-hotelier': { controller: 'HotelController', action: 'RemoveHotelRooms_Hotelier' },
  'POST /update-hotel-byid': { controller: 'HotelController', action: 'UpdateHotel' },
  'GET /get-hotels': { controller: 'HotelController', action: 'Get_Hotels' },
  'POST /get-hotels-for-admin': { controller: 'HotelController', action: 'Get_Hotels_For_Admin' },

  'POST /get-hotels-byid': { controller: 'HotelController', action: 'Get_Hotels_ById' },
  'POST /update-hotel-status': { controller: 'HotelController', action: 'Update_Hotel_Status' },
 
  
  'POST /remove-hotel': { controller: 'HotelController', action: 'Remove_Hotel' },
  'GET /deactivate-hotel': { controller: 'HotelController', action: 'Change_Hotel_Status' },
  'POST /hotel-image-upload': { controller: 'HotelController', action: 'Hotel_Images_Upload' },
  'POST /hotel-logo-upload': { controller: 'HotelController', action: 'Hotel_Logo_Upload' },
  'POST /get-hotel-images': { controller: 'HotelController', action: 'Get_HotelImages' },
  'POST /delete-hotel-image': { controller: 'HotelController', action: 'Remove_HotelImage' },
  'POST /get-bde-hotels': { controller: 'HotelController', action: 'Get_BDE_Hotels' },
  'POST /get-bde-reassigned-hotels': { controller: 'HotelController', action: 'Get_BDE_ReAssigned_Hotels' },
  'POST /get-bde-hotels-up': { controller: 'HotelController', action: 'Get_BDE_Hotels_Up' },
  'GET /get-generate-now': { controller: 'HotelController', action: 'Get_GenerateSample' },
  'POST /search-bde-hotels': { controller: 'HotelController', action: 'Search_BDE_Hotels' },
  'POST /get-bdm-hotels': { controller: 'HotelController', action: 'Get_BDM_Hotels' },
  'POST /get-bdm-hotels-admin': { controller: 'HotelController', action: 'Get_BDM_Hotels_Admin' },

  'POST /get-bdm-assigned-hotels': { controller: 'HotelController', action: 'Get_BDM_Assigned_Hotels' },
  // 'POST /restricted-delete-hotel': { controller: 'HotelController', action: 'Restricted_Delete_Hotel' },
  'POST /get-hotel-addon': { controller: 'HotelController', action: 'Get_Hotel_AddOn' },
  'POST /add-hotel-addon': { controller: 'HotelController', action: 'Add_Hotel_AddOn' },
  'POST /update-hotel-addon': { controller: 'HotelController', action: 'Update_Hotel_AddOn' },
  'POST /remove-hotel-addon': { controller: 'HotelController', action: 'Remove_Hotel_AddOn' },
  'POST /room-image-upload': { controller: 'HotelController', action: 'Room_Images_Upload' },
  'POST /remove-room-image': { controller: 'HotelController', action: 'Remove_RoomImage' },
  'POST /get-hotel-room-images': { controller: 'HotelController', action: 'Get_Hotel_Room_Images' },
  'POST /filter-hotels': { controller: 'FrontendController', action: 'Filter_Hotels' },
  'POST /get-hotel-seasonalmonths': { controller: 'HotelController', action: 'Get_Hotel_SeasonalMonths' },

  'POST /raise-hotel-complaint': { controller: 'HotelController', action: 'Raise_Hotel_Issue' },
  'POST /get-my-hotel-complaints': { controller: 'HotelController', action: 'Get_Hotel_Complaints' },
  'GET /get-all-hotel-complaints': { controller: 'HotelController', action: 'Get_All_Complaints' },
  'POST /restricted-remove-hotel': { controller: 'HotelController', action: 'Restricted_Remove_Hotel' },
  'GET /update-amenity': { controller: 'HotelController', action: 'Update_Amenity' },
  'POST /filtered-hotels': { controller: 'HotelController', action: 'Get_Hotels_Filtered' },

  'POST /paginated-hotels': { controller: 'HotelController', action: 'Get_Hotels_Admin_Paginated' },
  'GET /set-commission': { controller: 'HotelController', action: 'Set_Hotel_Commissions' },
  

  //-------------------Hotel Controller Routing-------------------------------------------------------------
  'POST /create-hotel-request': { controller: 'HotelRequestController', action: 'CreateHotelRequest' },
  'GET /get-hotel-request': { controller: 'HotelRequestController', action: 'GetHotelRequest' },
  'POST /send-hotel-request-tobde': { controller: 'HotelRequestController', action: 'Send_Request_BDE' },



  //-------------------Masters Controller Routing-----------------------------------------------------------
  'GET /get-amenities': { controller: 'MastersController', action: 'GetAmenities' },
  'POST /create-amenity': { controller: 'MastersController', action: 'CreateAmenity' },
  'POST /update-amenity': { controller: 'MastersController', action: 'Update_Amenity' },
  'POST /update-room-amenity': { controller: 'MastersController', action: 'Update_Room_Amenity' },
  'POST /remove-amenity': { controller: 'MastersController', action: 'RemoveAmenity' },
  'GET /get-facilities': { controller: 'MastersController', action: 'GetFacilities' },
  'POST /create-facility': { controller: 'MastersController', action: 'CreateFacility' },
  'POST /remove-facility': { controller: 'MastersController', action: 'RemoveFacility' },
  'POST /get-amenities-byid': { controller: 'MastersController', action: 'GetAmenities_ById' },
  'GET /get-states': { controller: 'MastersController', action: 'Get_States' },
  'GET /get-cities': { controller: 'MastersController', action: 'Get_Cities' },
  'GET /get-hotel-views': { controller: 'MastersController', action: 'Get_HotelViews' },
  'GET /get-room-views': { controller: 'MastersController', action: 'Get_RoomViews' },
  'GET /get-room-amenities': { controller: 'MastersController', action: 'Get_RoomAmenitiesList' },
  'POST /save-room-amenities': { controller: 'MastersController', action: 'Save_RoomAmenities' },
  'POST /remove-room-amenities': { controller: 'MastersController', action: 'Remove_RoomAmenities' },
  'POST /manage-status': { controller: 'MastersController', action: 'Manage_Status' },
  'POST /save-query': { controller: 'MastersController', action: 'Save_Query' },
  'POST /enquiries': { controller: 'MastersController', action: 'Get_Queries' },
  'GET /update-user-field': { controller: 'MastersController', action: 'Update_user_field' },
  'GET /update-addon-field': { controller: 'MastersController', action: 'Update_Addonfield' },
  
  'GET /update-room-field': { controller: 'MastersController', action: 'Update_room_field' },
  'GET /update-hotel-field': { controller: 'MastersController', action: 'Update_hotel_field' },
  'GET /update-hotel-createdate': { controller: 'MastersController', action: 'Update_hotel_createdate' },
  'GET /update-hotelier-id': { controller: 'MastersController', action: 'Update_hotelier_id' },

  
  

  //-------------------Admin Dashboard-------------------------------------------------------------------
  'GET /get-dashboard-counts': { controller: 'AdminController', action: 'Get_Dashboard_Counts' },
  'POST /get-bdm-dashboard-counts': { controller: 'AdminController', action: 'Get_BDM_Dashboard_Counts' },
  'POST /get-my-bde': { controller: 'AdminController', action: 'Get_My_BDE' },
  'POST /get-all-bdm-hotels': { controller: 'AdminController', action: 'Get_All_BDM_Hotels' },
  'POST /get-bdm-hotels-admin': { controller: 'AdminController', action: 'Get_BDM_Hotels_Admin' },
  'POST /get-mybde-travelagents': { controller: 'AdminController', action: 'Get_TravelAgents_BDM' },

  //-------------------Bid / Booking Controller----------------------------------------------------------------
  'POST /place-bid': { controller: 'BidController', action: 'Place_Bid' },
  'GET /rejected-bids': { controller: 'BidController', action: 'Get_Rejected_Bids' },
  'POST /rejected-bid': { controller: 'BidController', action: 'Save_Rejected_Bids' },
  'POST /get-all-bids': { controller: 'BidController', action: 'Get_All_Bids' },
  'POST /get-user-bids': { controller: 'BidController', action: 'Get_User_Bids' },
  'POST /get-user-bookings': { controller: 'BidController', action: 'Get_User_Bookings' },
  'POST /get-user-bookings-apponly': { controller: 'BidController', action: 'Get_User_Bookings_App' },
  'POST /get-all-bookings': { controller: 'BidController', action: 'Get_All_Bookings' },
  'POST /get-hotel-bookings': { controller: 'BidController', action: 'Get_hotel_Bookings' },
  'POST /get-filtered-hotel-bookings': { controller: 'BidController', action: 'Get_filtered_hotel_Bookings' },
  'POST /get-filtered-hotelier-bookings': { controller: 'BidController', action: 'Get_filtered_hotelier_Bookings' },
  'POST /get-all-hotel-bookings': { controller: 'BidController', action: 'Get_All_hotel_Bookings' },
  'POST /get-filtered-hotel-biddings': { controller: 'BidController', action: 'Get_filtered_hotel_Bidings' },
  'POST /get-hotel-bids': { controller: 'BidController', action: 'Get_My_Bids' },
  'POST /update-bid-status': { controller: 'BidController', action: 'Update_Bid_Status' },
  'POST /generate-booking': { controller: 'BidController', action: 'Generate_Booking' },
  'POST /handle-missed-bid-status': { controller: 'BidController', action: 'Handle_Missed_Bid_Status' },
  'POST /cancel-my-booking': { controller: 'BidController', action: 'Cancel_My_Booking' },
  'POST /cancel-status': { controller: 'BidController', action: 'Check_Booking_Cancellation_Status' },
  'PUT /booking-customer-details': { controller: 'BidController', action: 'Update_Booking_Customer_Details' },
  'POST /cancel-my-bidding': { controller: 'BidController', action: 'Cancel_Bid' },
  'PUT /booking-dates': { controller: 'BidController', action: 'Update_Booking_Date' },
  'POST /update-booking-room-status': { controller: 'BidController', action: 'Update_Booking_Room_Status' },

  //-------------------Hotelier Controller----------------------------------------------------------------

  'POST /hotelier-counts': { controller: 'HotelierController', action: 'Hotelier_Dashboard_Counts' },
  'POST /get-my-hotel': { controller: 'HotelierController', action: 'Get_My_Hotel' },
  'POST /save-hotel-faq': { controller: 'HotelierController', action: 'Save_FAQ' },
  'POST /update-hotel-faq': { controller: 'HotelierController', action: 'Update_FAQ' },
  'POST /get-hotel-faq': { controller: 'HotelierController', action: 'Get_Hotel_FAQ' },
  'POST /remove-faq': { controller: 'HotelierController', action: 'Remove_FAQ' },
  'POST /save-hotel-other-info': { controller: 'HotelierController', action: 'Save_Hotel_Other_Info' },
  'POST /get-hotel-other-info': { controller: 'HotelierController', action: 'Get_My_Hotel_Other_Details' },
  'POST /save-hotelier-documents': { controller: 'HotelierController', action: 'Hotelier_Documents_Upload' },
  'POST /get-my-documents': { controller: 'HotelierController', action: 'Get_My_Documents' },
  'POST /remove-my-documents': { controller: 'HotelierController', action: 'Remove_My_Documents' },
  'POST /hotelier-resend-email': { controller: 'HotelierController', action: 'Hotelier_Cred_Resend' },
  

  //----------------------------------Masters----------------------------------------------------------------------

  'POST /add-room-category': { controller: 'MastersController', action: 'Save_RoomCategory' },
  'POST /get-room-details': { controller: 'HotelController', action: 'Get_Room_Details' },
  'GET /get-room-category-list': { controller: 'MastersController', action: 'Get_RoomCategoryList' },
  'POST /remove-room-category': { controller: 'MastersController', action: 'Remove_RoomCategory' },
  'GET /get-hotel-categories': { controller: 'MastersController', action: 'Get_HotelCategories' },
  'GET /backup': { controller: 'MastersController', action: 'Dump_Backup_DB' },
  'GET /sms': { controller: 'MastersController', action: 'Sample_SMS' },
  


  // ---------------------------------------------------API ROUTES ENDS---------------------------------------

  'GET /': { controller: 'MastersController', action: 'HomePage' },

  //------------------------------Notifications List---------------------------------------------------------

  'GET /get-admin-notifications': { controller: 'MastersController', action: 'Get_AdminNotification' },
  'POST /get-bdm-notifications': { controller: 'MastersController', action: 'Get_BDMAppNotifications' },
  'POST /get-bde-notifications': { controller: 'MastersController', action: 'Get_BDEAppNotifications' },
  'POST /get-hotelier-notifications': { controller: 'MastersController', action: 'Get_HotelierNotifications' },
  'POST /get-frontuser-notifications': { controller: 'MastersController', action: 'Get_FrontUserNotifications' },
  'POST /send-notification-byrole': { controller: 'MastersController', action: 'Notification_By_Role' },
  'POST /send-notification-all': { controller: 'MastersController', action: 'Notification_All' },
  'GET /SaveTest_Notifications': { controller: 'MastersController', action: 'SaveTest_Notifications' },
  'POST /mark-read-notification': { controller: 'MastersController', action: 'Mark_Read_Notifications' },


  //--------------------------Frontend Controller--------------------------------------------------------------

  'POST /home-search': { controller: 'FrontendController', action: 'HomeSearch' },
  'GET /get-popular-hotels': { controller: 'FrontendController', action: 'PopularPlaces' },
  'POST /get-hotel-details': { controller: 'FrontendController', action: 'Get_Hotels_Details' },
  'POST /get-applanding-data': { controller: 'FrontendController', action: 'Get_App_Landing_Data' },

  //--------------------------Coupon Controller--------------------------------------------------------------
  'POST /save-update-coupon': { controller: 'CouponController', action: 'Save_And_Update_Coupon' },
  'POST /get-hotel-coupons': { controller: 'CouponController', action: 'Get_Hotel_Coupons' },

  //--------------------------Payment Controller--------------------------------------------------------------

  'GET /pay-now/:name/:email/:mobile/:strictkey/:bidid': { controller: 'PaymentController', action: 'Test' },
  'POST /save-payment-record': { controller: 'PaymentController', action: 'Save_Payment_Record' },
  'GET /get-all-payments': { controller: 'PaymentController', action: 'Get_All_Payments' },
  'POST /get-payments-bydate': { controller: 'PaymentController', action: 'Get_Payments_ByDate' },

  'POST /get-all-hotel-payments': { controller: 'PaymentController', action: 'Get_All_Hotel_Payments' },
  'POST /get-hotel-counts': { controller: 'PaymentController', action: 'Get_Hotel_Counts' },
  'GET /payment-thankyou': { controller: 'PaymentController', action: 'Payment_Thanks' },
  'POST /update-booking-info-by-bidid': { controller: 'PaymentController', action: 'Update_Booking_Info' },
  'POST /get-hotel-with-payments': { controller: 'PaymentController', action: 'Get_Hotel_With_Payments_Records' },
  'POST /get-refunds-by-dates': { controller: 'PaymentController', action: 'Get_Refunds_ByDate' },
  'POST /initiate-speed-refund': { controller: 'PaymentController', action: 'Init_Refund_Service' },
  'POST /app-payment': { controller: 'PaymentController', action: 'App_Payments' },
  'POST /generate-order-rzp': { controller: 'PaymentController', action: 'Generate_Order_Request_RZP' },


  //---------------------------Refund Controller---------------------------------------------------------------
  'Get /get-all-refunds': { controller: 'RefundController', action: 'Get_Booking_Refunds' },
  'POST /get-hotel-booking-refunds': { controller: 'RefundController', action: 'Get_Hotel_Booking_Refunds' },
  'POST /get-user-booking-refunds': { controller: 'RefundController', action: 'Get_User_Booking_Refunds' },

  //------------------invoice----------------------------------------------------------------------------------

  'GET /my-booking-invoice/:booking_id': { controller: 'PaymentController', action: 'My_Booking_Invoice' },

  //-------------------------Settings Routes--------------------------------------------------------------------
  'GET /get-settings': { controller: 'MastersController', action: 'Get_Settings' },
  'POST /get-setting-bytype': { controller: 'MastersController', action: 'Get_Setting_ByType' },
  'GET /get-zones': { controller: 'MastersController', action: 'Get_Zones' },

  'POST /add-settings': { controller: 'MastersController', action: 'Add_Settings' },
  'POST /update-settings': { controller: 'MastersController', action: 'Update_Settings' },
  'POST /remove-setting': { controller: 'MastersController', action: 'Remove_Setting' },
  'POST /update-image': { controller: 'MastersController', action: 'Upload_Image' },
  'POST /set-banner': { controller: 'MastersController', action: 'Set_Banner' },
  'GET /get-filter-cities': { controller: 'MastersController', action: 'Get_Filter_Cities' },

  //-------------------------Rating Controller------------------------------------------------------------------
  'POST /save-rating': { controller: 'RatingController', action: 'Save_Rating' },
  'POST /get-user-ratings': { controller: 'RatingController', action: 'Get_User_Ratings' },
  'POST /get-hotel-ratings': { controller: 'RatingController', action: 'Get_Hotel_Ratings' },
  'POST /update-rating-status': { controller: 'RatingController', action: 'Update_Rating_Status' },
  'GET /fake-hotels': { controller: 'HotelController', action: 'CreateHotelFake' },

  //------------------------Travel Agent Customer-----------------------------------------------------------------------------
  'POST /customer': { controller: 'AgentCustomerController', action: 'Save_Customer' },
  'PUT /customer': { controller: 'AgentCustomerController', action: 'Update_Customer' },
  'POST /get-my-customers': { controller: 'AgentCustomerController', action: 'Get_Customers' },
  'POST /remove-customer': { controller: 'AgentCustomerController', action: 'Remove_Customer' },
  'GET /mailcheck': { controller: 'HotelController', action: 'mailcheck' },

  //------------------------State GST Controller-----------------------------------------------------------------------------

  'GET /gst-list': { controller: 'StateGSTController', action: 'Get_GST_List' },
  'POST /create-gst': { controller: 'StateGSTController', action: 'Create_GST' },
  'POST /update-gst': { controller: 'StateGSTController', action: 'Update_GST' },

  //----------------------Deprecated Controller-----------------------------------------------------------------------------

  'POST /create-hotel-rooms': { controller: 'DeprecatedController', action: 'CreateHotelRooms' },
  'POST /create-hotel': { controller: 'DeprecatedController', action: 'CreateHotel' },

  

};
