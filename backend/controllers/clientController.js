const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const Leave = require("../models/leave.model");
const establishmentModel = require("../models/admin");
const supervisorModel = require("../models/supervisor.model");
const clientModel = require("../models/client.model");
const userModel = require("../models/user");
const educationModel = require("../models/education.model.js");
const experienceModel = require("../models/experience.model.js");
const hiringModel = require("../models/hiring.model.js");


exports.dashboardData = async (req, res) => {

        const currentClient = await clientModel.findOne({
            _id : req.user.id
          })
    
        res.send(currentClient);
    }

exports.getClientProfile = async(req, res) => {
        try{
            const currentClient = await clientModel.findOne({ _id : req.user.id })

            res.status(200).json({ message : 'fetched', success: true, currentClient});
        }
        catch(err){
            res.status(500).json({ message : 'Internal Server Error', success : false});
        }
    }