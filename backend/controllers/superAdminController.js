const superadminModel = require("../models/superadmin.model.js");

exports.getSuperAdminDashboard = async (req, res) => {

        const currentUser = await superadminModel.findOne({
            _id : req.user.id
          })
    
        res.send(currentUser);
    }