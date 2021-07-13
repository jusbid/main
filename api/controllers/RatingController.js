module.exports = {


    Save_Rating: async (req, res) => {

        if (!req.body.hotel_id || !req.body.userId || !req.body.value || !req.body.clean || !req.body.location || !req.body.service) {
            return res.send({ responseCode: 201, msg: 'Please all required parameters to save hotel rating' });
        }

        var AverageRating = req.body.value + req.body.clean + req.body.location + req.body.service;
        AverageRating = AverageRating / 5;

        let SavedRating = await Ratings.create({
            hotel_id: req.body.hotel_id,
            userId: req.body.userId,
            rating: AverageRating,
            feedback: req.body.feedback,
            booking_id: req.body.booking_id,
            // specific ratings-----------------------------------
            value: req.body.value,
            clean: req.body.clean,
            location: req.body.location,
            service: req.body.service,
        }).fetch()

        //----------------------Set New Rating For Hotel-------------------------------------------------

        let HotelRatings = await Ratings.find({ hotel_id: req.body.hotel_id });

        var TotalCountRatingsValue = HotelRatings.reduce((total, obj) => obj.value + total, 0);
        var TotalCountRatingsClean = HotelRatings.reduce((total, obj) => obj.clean + total, 0);
        var TotalCountRatingsLocation = HotelRatings.reduce((total, obj) => obj.location + total, 0);
        var TotalCountRatingsService = HotelRatings.reduce((total, obj) => obj.service + total, 0);

        let RecordsCount = HotelRatings.length;

        let RatingValue = TotalCountRatingsValue / RecordsCount;
        let RatingClean = TotalCountRatingsClean / RecordsCount;
        let RatingLocation = TotalCountRatingsLocation / RecordsCount;
        let RatingService = TotalCountRatingsService / RecordsCount;

        let TotalAverageRating = Math.ceil( (RatingValue + RatingClean + RatingLocation + RatingService) / 4 );

        await Hotel.updateOne({id:req.body.hotel_id}).set({rating:TotalAverageRating});

        await Bookings.updateOne({id:req.body.booking_id}).set({is_rated:true});

        if (SavedRating) {
            return res.send({ responseCode: 200, msg: 'Rating Saved..' });
        } else {
            return res.send({ responseCode: 201, msg: 'Rating not saved..' });
        }
    },

    Get_User_Ratings: async (req, res) => {

        let RatingsAll = await Ratings.find({}).sort('createdAt DESC');
        if (RatingsAll) {
            return res.send({ responseCode: 200, msg: 'Rating fetched..', data: RatingsAll });
        } else {
            return res.send({ responseCode: 201, msg: 'Rating not fetched..' });
        }

    },

    Get_Hotel_Ratings: async (req, res) => {

        if (!req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'Please provide required parameters to update rating' });
        }

        let RatingsAll = await Ratings.find({ hotel_id: req.body.hotel_id }).sort('createdAt DESC');

        if (RatingsAll) {
            return res.send({ responseCode: 200, msg: 'Rating fetched..', data: RatingsAll });
        } else {
            return res.send({ responseCode: 201, msg: 'Rating not fetched..' });
        }

    },

    Update_Rating_Status: async (req, res) => {

        if (!req.body.rating_id) {
            return res.send({ responseCode: 201, msg: 'Rating ID Not Found' });
        }
        let RatingsAll = await Ratings.updateOne({ id: req.body.rating_id }).set({ is_active: req.body.status });

        if (RatingsAll) {
            return res.send({ responseCode: 200, msg: 'Rating Updated..', data: RatingsAll });
        } else {
            return res.send({ responseCode: 201, msg: 'Rating not updated..' });
        }
    }



}