module.exports = {
  

    Save_BankDetails: async (req, res) => {

        sails.log(req.body, 'save bank details data');

        let CheckDetails = await BankDetails.findOne({userId:req.body.userId})

        if(CheckDetails){
            var UpdatedBankDetails = await BankDetails.update({userId: req.body.userId}).set({
            
                bank_account_name:req.body.bank_account_name,
                bank_name:req.body.bank_name,
                account_no:req.body.account_no,
                ifsc:req.body.ifsc,
                bank_branch:req.body.bank_branch,
                //new keys
                account_type:req.body.account_type,
                gst_no:req.body.gst_no,
                gst_state:req.body.gst_state
    
            });

        }else{
            var UpdatedBankDetails = await BankDetails.create({
            
                userId: req.body.userId,
                bank_account_name:req.body.bank_account_name,
                bank_name:req.body.bank_name,
                account_no:req.body.account_no,
                ifsc:req.body.ifsc,
                bank_branch:req.body.bank_branch,
                //new keys
                account_type:req.body.account_type,
                gst_no:req.body.gst_no,
                gst_state:req.body.gst_state
    
            });
        }

        return res.send({ responseCode: 200, msg: 'User with userId ' + req.body.userId + ', Bank details updated successfully', data:UpdatedBankDetails });
       
    },


    Get_BankDetails: async (req, res) => {

        let BankDetailRecord = await BankDetails.findOne({userId:req.body.userId});

        return res.send({ responseCode: 200, data: BankDetailRecord });
    },

    Remove_BankDetails: async (req, res) => {

        let BankDetailRecord = await BankDetails.destroy({userId:req.body.userId});

        return res.send({ responseCode: 200, data: BankDetailRecord });
    }


};

