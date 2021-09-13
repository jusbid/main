var fs = require('fs');
var async = require('async');

module.exports = {

    View_Change_City: async (req, res) => {
        return res.view('pages/utility/renameCity', {
        });
    },

    Update_Cities: async (req, res) => {

        let current_city = req.body.current_city;
        let update_city = req.body.update_city;

        if (!current_city || !update_city) {
            return;
        }

        let HotelUpdate = await Hotel.update({ city: current_city }).set({ city: update_city });

        return res.view('pages/utility/renameCity', {
        });
    }

}