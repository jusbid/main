module.exports = {

    Get_GST_List: async (req, res) => {

        var Data = await StateGST.find({});

        if (Data) {
            return res.send({ responseCode: 200, msg: 'StateGST data fetched', data: Data });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to fetch StateGST' });
        }

    },

    Create_GST: async (req, res) => {

        if (!req.body.gst_state || !req.body.gst_no) {
            return res.send({ responseCode: 201, msg: 'Please provide both gst_state & gst_no' });
        }

        var find_check = await StateGST.findOne({ gst_state: req.body.gst_state });

        if (find_check) {
            return res.send({ responseCode: 201, msg: 'StateGST exists already' });
        }

        var Data = await StateGST.create({ gst_state: req.body.gst_state, gst_no: req.body.gst_no, gst_address: req.body.gst_address, gst_city: req.body.gst_city });

        if (Data) {
            return res.send({ responseCode: 200, msg: 'StateGST data created', data: Data });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to create StateGST' });
        }

    },

    Update_GST: async (req, res) => {

        if (!req.body.gst_state || !req.body.gst_no || !req.body.id) {
            return res.send({ responseCode: 201, msg: 'Please provide both gst_state & gst_no' });
        }

        var Data = await StateGST.updateOne({ id: req.body.id }).set({ gst_state: req.body.gst_state, gst_no: greq.body.st_no, gst_address: req.body.gst_address, gst_city: req.body.gst_city });

        if (Data) {
            return res.send({ responseCode: 200, msg: 'StateGST data update', data: Data });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to update StateGST' });
        }

    },



}