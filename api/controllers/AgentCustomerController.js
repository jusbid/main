
var async = require('async');


module.exports = {

    Save_Customer: async (req, res) => {

        let userId = req.body.userId;

        if (!userId) {
            return res.send({ responseCode: 201, msg: 'Please provide userId' });
        }

        let AgentCustomersData = await AgentCustomers.create({
            userId: userId,
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            address: req.body.address
        }).fetch();

        if (!AgentCustomersData) {
            return res.send({ responseCode: 201, msg: 'AgentCustomersData not Added, please try again..' });
        } else {
            return res.send({ responseCode: 200, msg: 'AgentCustomersData Added successfully', data: AgentCustomersData });

        }

    },

    Update_Customer: async (req, res) => {

        let userId = req.body.userId;
        let customer_id = req.body.customer_id;
        if (!userId || !customer_id) {
            return res.send({ responseCode: 201, msg: 'Please provide userId & customer_id' });
        }

        let AgentCustomersData = await AgentCustomers.updateOne({ id: customer_id, userId: userId }).set({
            userId: userId,
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            address: req.body.address
        });

        if (!AgentCustomersData) {
            return res.send({ responseCode: 201, msg: 'AgentCustomersData not Added, please try again..' });
        } else {
            return res.send({ responseCode: 200, msg: 'AgentCustomersData Added successfully', data: AgentCustomersData });

        }

    },

    Get_Customers: async (req, res) => {
        let userId = req.body.userId;

        if (!userId) {
            return res.send({ responseCode: 201, msg: 'Please provide userId' });
        }

        let AgentCustomersData = await AgentCustomers.find({userId: userId })


        if (!AgentCustomersData) {
            return res.send({ responseCode: 201, msg: 'Agent Customers Data not fetched, please try again..' });
        } else {
            return res.send({ responseCode: 200, msg: 'Agent Customers Data fetched successfully', data: AgentCustomersData });

        }
    },

    Remove_Customer: async (req, res) => {
        let customer_id = req.body.customer_id;

        if (!customer_id) {
            return res.send({ responseCode: 201, msg: 'Please provide customer_id' });
        }

        let AgentCustomersData = await AgentCustomers.destroyOne({id: customer_id })


        if (!AgentCustomersData) {
            return res.send({ responseCode: 201, msg: 'Unable to Remove Agent Customer' });
        } else {
            return res.send({ responseCode: 200, msg: 'Agent Customers Data removed successfully', data: AgentCustomersData });

        }

    },


}