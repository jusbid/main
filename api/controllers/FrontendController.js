var SHA256 = require("crypto-js/sha256");
var fs = require('fs');
var async = require('async');


module.exports = {


    HomeSearch: async (req, res) => {

        var city = req.body.city;
        var arrival = req.body.arrival;
        var departure = req.body.departure;
        var guest_no = req.body.guest_no;
        var lat = req.body.lat;
        var long = req.body.long;

        let Searched_hotels = await Hotel.find({ city: city, is_deleted: false,  status:'Approved' }).limit(1000);

        async.forEachOf(Searched_hotels, function (value, i, callback) {

            HotelRooms.find({ hotel_id: value.id }).sort('price ASC').exec(function (err, HotelRooms) {
                if (HotelRooms.length == 0) {
                    Searched_hotels[i].room_price = null;
                } else {
                    Searched_hotels[i].room_price = HotelRooms[0].price;
                }

                callback();
            });

        }, function (err) {

            if (!Searched_hotels) {
                return res.send({ responseCode: 201, msg: 'Hotels not found using this criteria', err: err });
            } else {
                return res.send({ responseCode: 200, msg: 'Hotels Fetched successfully', data: Searched_hotels });

            }

        });

    },


    PopularPlaces: async (req, res) => {

        let popular_hotels = await Hotel.find({ status: 'Approved', is_deleted: false }).sort('rating DESC').limit(100);
        var CitiesArr = [];
        async.forEachOf(popular_hotels, function (value, i, callback) {
            var CityValue = value.city;
            if (CityValue) {
                let CityCheck = CitiesArr.filter(function (itm) { return itm.city == CityValue; });
                let index = CitiesArr.findIndex(x => x.city == CityValue);

                sails.log(CityCheck, 'CityCheck');


                if (CityCheck.length != 0) {
                    CitiesArr[index].hotels = 1 + CitiesArr[index].hotels;
                    if (!CitiesArr[index].image || CitiesArr[index].image == '') {
                        CitiesArr[index].image = value.image;
                    }
                } else {
                    CitiesArr.push({ hotels: 1, image: value.image, city: CityValue });
                }
            }
            //set room price----------------------------------------------------------------
            HotelRooms.find({ hotel_id: value.id }).sort('price ASC').exec(function (err, HotelRooms) {
                if (HotelRooms.length == 0) {
                    popular_hotels[i].room_price = null;
                } else {
                    popular_hotels[i].room_price = HotelRooms[0].price;
                }

                callback();
            });
        }, function (err) {
            let SendData = {
                popular_hotels: popular_hotels,
                popular_cities: CitiesArr
            }
            return res.send({ responseCode: 200, data: SendData });
        });
    },



    Get_Hotels_Details: async (req, res) => {

        let hotel_id = req.body.hotel_id;

        if (!hotel_id) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel id' });
        }

        let HotelData = await Hotel.findOne({
            id: hotel_id, is_deleted: false
        });


        if (!HotelData) {
            return res.send({ responseCode: 201, msg: 'No hotel found using this id' });
        }

        let city_name = HotelData.city;

        //------------------------------
        let RatingsObj = {};
        let HotelRatings = await Ratings.find({ hotel_id: hotel_id });

        let HotelRatingsTotal = HotelRatings.length;

        if (HotelRatingsTotal != 0) {

            let valuetmp = HotelRatings.reduce(function (cnt, o) { return cnt + o.value; }, 0);
            let cleantmp = HotelRatings.reduce(function (cnt, o) { return cnt + o.clean; }, 0);
            let locationtmp = HotelRatings.reduce(function (cnt, o) { return cnt + o.location; }, 0);
            let servicetmp = HotelRatings.reduce(function (cnt, o) { return cnt + o.service; }, 0);
            RatingsObj.value = valuetmp / HotelRatingsTotal;
            RatingsObj.clean = cleantmp / HotelRatingsTotal;
            RatingsObj.location = locationtmp / HotelRatingsTotal;
            RatingsObj.service = servicetmp / HotelRatingsTotal;
            RatingsObj.totalRatings = HotelRatingsTotal;

        } else {
            RatingsObj.value = 0;
            RatingsObj.clean = 0;
            RatingsObj.location = 0;
            RatingsObj.service = 0;
            RatingsObj.totalRatings = 0;
        }

        //----------------------------------------------------------------

        let HotelImagesData = await HotelImages.find({ hotel_id: hotel_id }).sort('name ASC');
        HotelData.hotel_images = [];

        if (HotelImagesData) { HotelData.hotel_images = HotelImagesData }
        let HotelOtherInfos = await HotelOther.find({ hotel_id: hotel_id, type: ['Policy', 'Refund', 'Notice', 'Terms'] });
        HotelData.HotelOtherInfo = HotelOtherInfos;

        let GetHotelFAQ = await faq.find({ hotel_id: hotel_id }).sort('createdAt DESC');
        HotelData.FAQ = GetHotelFAQ;

        //----------------------------------Get Amenities----------------------------------------------------------------------------------------

        if (HotelData.hotel_amenities instanceof Array) {

            let HotelAmenities = await Amenities.find({ id: HotelData.hotel_amenities });
            HotelData.Amenities = HotelAmenities;
        } else {
            HotelData.Amenities = [];
        }

        //-----------------------------------------------------Set Recommended Hotels-------------------------------------------------------------
        sails.log(city_name, 'city_name');
        var RecommendedHotels = await Hotel.find({ select: ['id', 'name', 'image', 'rating', 'city', 'status'] }).where({ city: city_name, status: 'Approved', is_deleted: false }).sort('rating DESC').limit(10);

        //Remove Same Hotel-----------------------------------------------

        RecommendedHotels = RecommendedHotels.filter(hoteldata => { return hoteldata.id != hotel_id });

        let HotelRoomsData = await HotelRooms.find({ hotel_id: hotel_id });
        HotelData.hotel_rooms = HotelRoomsData;

        async.forEachOf(HotelRoomsData, function (valueRoom, i, callback) {

            RoomImages.find({ room_id: valueRoom.id }).exec(function (err, resultImages) {
                HotelRoomsData[i].room_images = resultImages;
                callback();
            });


        }, function (err) {

            async.forEachOf(RecommendedHotels, function (value, i, callback) {
                sails.log(value.city, 'city_name hotel');
                HotelRooms.find({ hotel_id: value.id, price: { '!=': null } }).exec(function (err, resultRooms) {

                    if (resultRooms.length != 0) {
                        if (RecommendedHotels[i]) RecommendedHotels[i].room_price = resultRooms[0].price;
                    } else {

                    }
                    callback();
                })
            }, function (err) {

                if (err) { sails.log(err) }

                //--------------------------Removing Other Hotel With Not Room Data-----------------------------------------------------------------------

                RecommendedHotels = RecommendedHotels.filter(function (obj) {
                    return obj.room_price != null;
                });

                HotelData.recommended_hotels = RecommendedHotels;
                Ratings.find({ hotel_id: hotel_id, is_active: true }).limit(20).sort('createdAt DESC').exec(function (err, resultRatings) {
                    HotelData.Feedback = resultRatings;
                    //get username of feedback creator----------------------------------------------------------------------------------------------------
                    async.forEachOf(HotelData.Feedback, function (value, i, callback) {
                        User.findOne({ userId: value.userId, }).exec(function (err, userdata) {

                            if (userdata) {
                                HotelData.Feedback[i].customer_name = userdata.firstname + " " + userdata.lastname;
                            }
                            callback();
                        })
                    }, function (err) {
                        if (err) { sails.log(err) }
                        HotelData.RatingsData = RatingsObj;
                        if (!HotelData) {
                            return res.send({ responseCode: 201, msg: 'No hotel found using this id' });
                        }
                        else {
                            return res.send({ responseCode: 200, data: HotelData });
                        }

                    });
                });

            });

        });

    },


    Filter_Hotels: async (req, res) => {

        var arrival = req.body.arrival;
        var departure = req.body.departure;
        var guest_no = req.body.guest_no;
        var lat = req.body.lat;
        var long = req.body.long;
        var city = req.body.city;
        var FilterBy = req.body.filterBy;
        var sortBy = req.body.sortBy;
        if (!sortBy || sortBy == '') { sortBy = 'rating DESC' }

        var RangeMax = req.body.rangeMax;
        var RangeMin = req.body.rangeMin;

        var AmenityFilter = req.body.selectedAmenity;
        var CategoryFilter = req.body.selectedCategory;

        var Searched_hotels = [];
        var applySort = 'price DESC';
        if (sortBy == 'price DESC' || sortBy == 'price ASC') { applySort = 'rating DESC' } else { applySort = sortBy }
        Searched_hotels = await Hotel.find({ city: city, is_deleted: false,  status:'Approved' }).sort(applySort).limit(100);

        async.forEachOf(Searched_hotels, function (value, i, callback) {
            //-------------------------------------- Set Lowest Room Price---------------------------------
            HotelRooms.find({ hotel_id: value.id }).sort('price ASC').exec(function (err, HotelRooms) {
                if (HotelRooms.length == 0) {
                    Searched_hotels[i].room_price = null;
                } else {
                    Searched_hotels[i].room_price = HotelRooms[0].price;
                }

                callback();
            });

        }, function (err) {
            if (err) { sails.log(err) };
            if (RangeMax && RangeMin) {
                Searched_hotels = Searched_hotels.filter(function (hotel_data) {
                    //Filter By Pricing-----------------------------------------------------------------------------------------------------
                    if (!hotel_data.room_price) { return false }
                    return parseInt(hotel_data.room_price) <= parseInt(RangeMax) && parseInt(hotel_data.room_price) >= parseInt(RangeMin);
                });
            }


            if (AmenityFilter && AmenityFilter != '' && AmenityFilter != []) {
                //Filter By Amentity ID-----------------------------------------------------------------------------------------------------
                Searched_hotels = Searched_hotels.filter(function (hotel_data) {
                    var tempcheck = false;
                    if (!hotel_data.hotel_amenities) { return false }
                    AmenityFilter.forEach((value, index) => {
                        tempcheck = hotel_data.hotel_amenities.includes(value);
                    });
                    return tempcheck;

                });
            }

            if (CategoryFilter && CategoryFilter != '') {
                //Filter By Category Name-----------------------------------------------------------------------------------------------------
                Searched_hotels = Searched_hotels.filter(function (hotel_data) {
                    if (!hotel_data.category) { return }
                    return hotel_data.category == CategoryFilter;
                });
            }

            //-------------------------SortByPrice-----------------------------------------------------------
            if (sortBy == 'price ASC') {
                Searched_hotels.sort(function (a, b) {
                    var keyA = a.room_price,
                        keyB = b.room_price;
                    // Compare the 2 dates
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                });
            } else if (sortBy == 'price DESC') {
                Searched_hotels.sort(function (a, b) {
                    var keyA = a.room_price,
                        keyB = b.room_price;
                    // Compare the 2 dates
                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                    return 0;
                });
            }


            return res.send({ responseCode: 200, msg: 'Hotels Fetched successfully', data: Searched_hotels });

        })

    },


    Get_App_Landing_Data: async (req, res) => {

        let Latitude = req.body.latitude;
        let Longitude = req.body.longitude;

        var fieldsSelect = ['name', 'plot_no', 'area', 'street', 'address', 'city', 'state', 'rating', 'id', 'status', 'image', 'latitude', 'longitude'];

        let popular_places = [
            { city: "Mumbai", image: "/images/landing/1.jpg" },
            { city: "Delhi", image: "/images/landing/2.jpg" },
            { city: "Banglore", image: "/images/landing/3.jpg" },
            { city: "Kolkata", image: "/images/landing/4.jpg" },
            { city: "Jaipur", image: "/images/landing/5.jpg" },
            { city: "Udaipur", image: "/images/landing/6.jpg" },
            { city: "Indore", image: "/images/landing/7.jpg" },
            { city: "Goa", image: "/images/landing/8.jpg" },
            { city: "Ahmedabad", image: "/images/landing/9.jpg" },
            { city: "Mysore", image: "/images/landing/10.jpg" },
        ];

        let recommended_hotels = await Hotel.find({ select: fieldsSelect }).where({ is_deleted: false, status:'Approved' }).limit(30);
        let UserLatLong = { lat: 24.5854, long: 73.7125 }
        if(Latitude && Longitude){UserLatLong.lat = Latitude; UserLatLong.long = Longitude}
        let featured_hotels = await Hotel.find({ select: fieldsSelect }).where({ is_deleted: false, status:'Approved' }).limit(10);
        let BannerData = await Settings.findOne({ type: "FrontBanner" });
        var BannerImageLink = 'https://jusbid.in:1337/images/app/banner.png';
        if (BannerData) { BannerImageLink = 'https://jusbid.in:1337' + BannerData.data_string }

        let costing_hotels = [
            { price: 1000, image: "/images/landing/2.jpg" },
            { price: 2000, image: "/images/landing/4.jpg" },
            { price: 3000, image: "/images/landing/6.jpg" },
            { price: 4000, image: "/images/landing/8.jpg" },
            { price: 5000, image: "/images/landing/10.jpg" },
            { price: 10000, image: "/images/landing/1.jpg" },
            { price: 50000, image: "/images/landing/3.jpg" }
        ];

        var RecommendedFiltered = [];

        async.forEachOf(recommended_hotels, function (hotel, i, callback) {

            let HotelLatLong = { lat: hotel.latitude, long: hotel.longitude }
            let CheckHotelPosition = functions.Check_Lat_Long(UserLatLong, HotelLatLong, 100);

            if (CheckHotelPosition) {
                //push room price----------------------------------------------------------------

                HotelRooms.find({ hotel_id: hotel.id }).sort("price ASC").limit(5).exec(function (err, HotelRoomsData) {
                    if (HotelRoomsData.length != 0) {
                        recommended_hotels[i].room_price = HotelRoomsData[0].price
                    } else {
                        recommended_hotels[i].room_price = null
                    }
                    RecommendedFiltered.push(hotel);
                    callback();
                });
            } else {
                callback();
            }

        }, function (err) {


            async.forEachOf(featured_hotels, function (hoteldata, i, callback) {

                HotelRooms.find({ hotel_id: hoteldata.id }).sort("price ASC").limit(5).exec(function (err, HotelRoomsData) {
                    if (HotelRoomsData.length != 0) {
                        featured_hotels[i].room_price = HotelRoomsData[0].price
                    } else {
                        featured_hotels[i].room_price = null
                    }
                    callback();
                });

            }, function (err) {

                let SendData = {
                    popular: popular_places,
                    recommended: RecommendedFiltered,
                    by_costing: costing_hotels,
                    banner: BannerImageLink,
                    featured: featured_hotels
                }

                return res.send({ responseCode: 200, data: SendData });


            })

        })

    },

}