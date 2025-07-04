const express = require("express")
const router = express.Router();
const bcrypt = require('bcrypt');
const adminModel = require("../models/admin.js");
const superadminModel = require("../models/superadmin.model.js");
const userModel = require("../models/user.js");
const clientModel = require("../models/client.model.js");
const supervisorModel = require("../models/supervisor.model.js");
const educationModel = require("../models/education.model.js");
const experienceModel = require("../models/experience.model.js");
const clientlocationModel = require("../models/clientlocation.model.js");
const hiringModel = require("../models/hiring.model.js");
const hiredModel = require("../models/hired.model.js");
const { uploadImage } = require('../middleware/multer.js');
const { uploadPDF } = require('../middleware/multer.js');
const { uploadImageAndPdf } = require('../middleware/multer.js');
const path = require('path');
const fs = require('fs');
const { uploadSignature, deleteSignature, leavePageData, leaveApplication } = require('../controllers/userController');
const userController = require('../controllers/userController');

// Increase EventEmitter max listeners
require('events').EventEmitter.defaultMaxListeners = 15;

const { userlogin, usersignup, adminsignup, adminlogin, clientregister, clientlogin, supervisorlogin, supervisorregister, superadminlogin, superadminsignup } = require("../controller/auth")

const { auth, isUser, isAdmin, isSuperadmin, isSupervisor } = require("../middleware/auth");

// router.post("/login", login)
router.post("/usersignup", usersignup)
router.post("/userlogin", userlogin)
router.post("/adminsignup", adminsignup)
router.post("/adminlogin", adminlogin)
router.post("/establisment/client_register", auth, clientregister);
router.post("/clientlogin", clientlogin);
router.post("/establisment/supervisor_register", auth, supervisorregister);
router.post("/supervisorlogin", supervisorlogin);
router.post("/superadmin-login", superadminlogin);
router.post("/superadmin-sighup", superadminsignup);

//protected route

router.get("/test", auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: "the user is authentic"
    })
})

router.get("/student", auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: "welcome to the protected route for the student"
    })
})

router.get("/admin", auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: "welcome to the protected route for the Admin"
    })
})

router.get("/Hii", auth, (req, res) => {
    // res.send("hii");
    res.status(200).json({
        success: true,
        message: "welcome to the protected route for the Admin"
    })
})

router.post("/check", auth, (req, res) => {
    let currentUser = req.user;
    res.send(currentUser);
})



router.get("/user/profile",auth, isUser, userController.profileData);

router.get("/establisment/profile",auth, async (req, res) => {

    // const requestHistory = await requestModel.find(req.user._id.equals(user));
    const currentEstablisment = await adminModel.findOne({
        _id : req.user.id
    })
    .populate({
        path : 'clients',
        populate : {
            path : 'locations',
            model : 'Clientlocation'
        }
    })
    .populate('hirings')
    res.send(currentEstablisment);
});

    router.get("/userdashboard",auth, async (req, res) => {

        
        const currentUser = await userModel.findOne({
            _id : req.user.id
          })
    
        res.send(currentUser);
    });

    router.get("/client-dashboard",auth, async (req, res) => {

        const currentClient = await clientModel.findOne({
            _id : req.user.id
          })
    
        res.send(currentClient);
    });

    router.get("/profile_pic",auth, async (req, res) => {

        const currentUser = await userModel.findOne({
            _id : req.user.id
          }, {
            _id : 1, profilePic : 1
          } )
    
        res.send(currentUser);
    });

    router.get("/supervisor-dashboard",auth, async (req, res) => {

        const currentUser = await supervisorModel.findOne({
            _id : req.user.id
          })

        res.send(currentUser);
    });

    router.get("/superadmin-dashboard",auth, isSuperadmin, async (req, res) => {

        const currentUser = await superadminModel.findOne({
            _id : req.user.id
          })
    
        res.send(currentUser);
    });

    router.get("/establisment/clientlist",auth, async (req, res) => {

            const currentEstablisment = await adminModel.findOne({
                _id : req.user.id
              })
              .populate('clients');
        
            res.send(currentEstablisment);
        });

        router.get("/establisment/supervisorlist",auth, async (req, res) => {

            const currentEstablisment = await adminModel.findOne({
                _id : req.user.id
              })
              .populate('supervisors');
        
            res.send(currentEstablisment);
        });


    router.post("/user/profile/add_Pan",auth, async(req, res) => {
        const { full_name, pan_number} = req.body;

        try{
            const currentUser = await userModel.findOne({ _id : req.user.id});

            if(currentUser.full_Name.toUpperCase() === full_name.toUpperCase()){
                currentUser.pan_number = pan_number;
                currentUser.pan_name = full_name;
                currentUser.pan_added = true;
                await currentUser.save();
                res.json({message : "Pan Added", success : true});
            }else{
                res.json({message : "Name of Pan Card and Aadhar Card not matched", success : false});
            }
        }catch(err){
            res.json({message : "error Occured", success : false});
        }
    });

    router.post("/user/profile/add_uan_esic",auth, async(req, res) => {
        const { uanNumber, esicNumber} = req.body;

        try{
            const currentUser = await userModel.findOne({ _id : req.user.id});

            currentUser.uan_number = uanNumber;
            currentUser.esic_number = esicNumber;
            currentUser.uan_esic_added = true;
            await currentUser.save();
            res.json({message : "UAN and ESIC Added", success : true});
        }catch(err){
            res.json({message : "error Occured", success : false});
        }
    });


    router.post("/user/profile/add_Account",auth, async(req, res) => {
        const { account_number, data} = req.body;

        try{
            const currentUser = await userModel.findOne({ _id : req.user.id});

            
            if(currentUser.full_Name.toUpperCase() === data.full_name.toUpperCase()){
                currentUser.account_number = account_number;
                currentUser.account_name = data.full_name;
                currentUser.account_added = true;
                currentUser.account_ifsc = data.ifsc_details.ifsc;
                await currentUser.save();
                res.json({message : "Account Added", success : true});
            }else{
                res.json({message : "Name of Bank Account and Aadhar Card not matched", success : false});
            }
        }catch(err){
            res.json({message : "Account not Added", success : false});
        }
    })

    router.post("/establishment/profile/add_Pan",auth, async(req, res) => {
        // const { full_name, pan_number} = req.body;
        const { userId, panInfo } = req.body;

        try{
            const currentUser = await userModel.findOne({ _id : userId});

            // if(currentUser.full_Name == full_name){
                currentUser.pan_number = panInfo.pan_number;
                currentUser.pan_name = panInfo.full_name;
                currentUser.pan_added = true;
                await currentUser.save();
                res.json({message : "Pan Added", success : true});
            // }else{
                // res.json({message : "Name of Pan Card and Aadhar Card not matched", success : false});
            // }
        }catch(err){
            res.json({message : "error Occured", success : false});
        }
    })
    router.post("/establishment/profile/add_Account",auth, async(req, res) => {
        const { account_number, data, userId} = req.body;

        try{
            const currentUser = await userModel.findOne({ _id : userId});

                currentUser.account_number = account_number;
                currentUser.account_name = data.full_name;
                currentUser.account_added = true;
                currentUser.account_ifsc = data.ifsc_details.ifsc;
                await currentUser.save();
                res.json({message : "Account Added", success : true});
        }catch(err){
            res.json({message : "Account not Added", success : false});
        }
    })

    router.post("/establisment/client_data", async(req, res) => {
        
        const { state } = req.body;

        try{
            const clientDetail = await clientModel.findOne({ _id : state})
            .populate('locations')

            const currentEstablisment = await adminModel.findOne({ _id : clientDetail.establisment })
            .populate('supervisors')

            res.json({message : "check", data : clientDetail, supervisors : currentEstablisment.supervisors, success : true});
        }catch(err){
            res.json({ message : err, success : false});
        }    
    });

    router.post("/establisment/supervisor_data", async(req, res) => {
        
        const { state } = req.body;

        try{
            const supervisorDetail = await supervisorModel.findOne({ _id : state});
            res.json({message : "fetched", data : supervisorDetail , success : true});
        }catch(err){
            res.json({ message : err, success : false});
        }    
    });

    router.post("/user/add_education", auth, async(req, res) => {
        try{
            const { institute, degree, starting_month, starting_year, ending_month, ending_year, score, description, editId } = req.body;

            if(!institute || !degree || !starting_month || !starting_year || !ending_month || !ending_year || !score){
                return res.json({message : "Please Enter all the data", success : false});
            }

            if(editId !== ''){
                const currentEducation = await educationModel.findOne({ _id : editId });

                currentEducation.institute = institute;
                currentEducation.degree = degree;
                currentEducation.starting_month = starting_month;
                currentEducation.starting_year = starting_year;
                currentEducation.ending_month = ending_month;
                currentEducation.ending_year = ending_year;
                currentEducation.score = score;
                currentEducation.description = description;

                await currentEducation.save();

                const currentUser1 = await userModel.findOne({ _id : currentEducation.user })
                .populate('qualifications')
                .populate('experiences')

                return res.status(200).json({ success : true, message : "education Updated", currentUser1});
            }

            const currentUser = await userModel.findOne({
                _id : req.user.id
            });

            const newEducation = await educationModel.create({
                institute, degree, starting_month, starting_year, ending_month, ending_year, score, description, user : currentUser._id
            });

            currentUser.qualifications.push(newEducation._id);
            await currentUser.save();

            const currentUser1 = await userModel.findOne({
                _id : req.user.id
            })
            .populate('qualifications')
            .populate('experiences')

            return res.status(200).json({
                success : true,
                message : "Education Added",
                currentUser1
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: "plz try again later"
            })
        }
    })

    router.post("/user/add_experience", auth, async(req, res) => {
        try {
            const { company, role, starting_month, starting_year, ending_month, ending_year, location, description, editId } = req.body;

            if(!company || !role || !starting_month || !starting_year || !location){
                return res.status(400).json({message : "Please Enter all the required data", success : false});
            }

            if(editId && editId !== ''){
                const currentExperience = await experienceModel.findOne({ _id : editId });
                
                if (!currentExperience) {
                    return res.status(404).json({ 
                        success: false, 
                        message: "Experience not found" 
                    });
                }

                currentExperience.company = company;
                currentExperience.role = role;
                currentExperience.starting_month = starting_month;
                currentExperience.starting_year = starting_year;
                currentExperience.ending_month = ending_month || "";
                currentExperience.ending_year = ending_year || "";
                currentExperience.location = location;
                currentExperience.description = description || "";

                await currentExperience.save();

                const currentUser1 = await userModel.findOne({ _id : currentExperience.user })
                    .populate('qualifications')
                    .populate('experiences');

                return res.status(200).json({ 
                    success: true, 
                    message: "Experience Updated", 
                    currentUser1 
                });
            }

            const currentUser = await userModel.findOne({ _id : req.user.id });
            if (!currentUser) {
                return res.status(404).json({ 
                    success: false, 
                    message: "User not found" 
                });
            }

            const newExperience = await experienceModel.create({
                company, 
                role, 
                starting_month, 
                starting_year, 
                ending_month: ending_month || "", 
                ending_year: ending_year || "", 
                location, 
                description: description || "", 
                user: currentUser._id
            });

            currentUser.experiences.push(newExperience._id);
            await currentUser.save();

            const currentUser1 = await userModel.findOne({ _id : req.user.id })
                .populate('qualifications')
                .populate('experiences');

            return res.status(200).json({
                success: true,
                message: "Experience Added",
                currentUser1
            });
        } catch (err) {
            console.error("Add experience error:", err);
            return res.status(500).json({
                success: false,
                message: "Please try again later"
            });
        }
    });

    router.post("/user/delete_education", auth, async(req, res) => {

        const { uid } = req.body;

        try{
            const currentEducation = await educationModel.deleteOne({ _id : uid });
            

            const currentUser = await userModel.findOne({ _id : req.user.id })
            .populate("qualifications")
            .populate('experiences')
            // currentEducation.deleteOne();

            return res.status(200).json({ message : "education deleted", success : true, currentUser});
        }catch(err){
            return res.status(500).json({ message : "internal server error", success : false});
        }
    })
    router.post("/user/delete_experience", auth, async(req, res) => {

        const { uid } = req.body;

        try{
            const currentExperience = await experienceModel.deleteOne({ _id : uid });
            

            const currentUser = await userModel.findOne({ _id : req.user.id })
            .populate("qualifications")
            .populate('experiences')

            return res.status(200).json({ message : "experience deleted", success : true, currentUser});
        }catch(err){
            return res.status(500).json({ message : "internal server error", success : false});
        }
    })

    router.post("/user/add_location", auth, async(req, res) => {
        try{
            const { name, contact, location, state, email, editId, client_id, supervisor } = req.body;

            const arr = supervisor.split(",");

            if(!name || !contact || !location || !state || !email ){
                res.json({message : "Please Enter all the data", success : false});
            }

            
            if(editId !== ''){
                const currentLocation = await clientlocationModel.findOne({ _id : editId });

                const previousSupervisor = await supervisorModel.findOne({ _id : currentLocation.supervisor });
                const index = previousSupervisor.locations.indexOf(currentLocation._id);
                
                if(index > -1){
                    previousSupervisor.locations.splice(index, 1);
                    await previousSupervisor.save();
                }

                currentLocation.name = name;
                currentLocation.email = email;
                currentLocation.contact = contact;
                currentLocation.state = state;
                currentLocation.location = location;
                currentLocation.supervisor = arr[0];

                await currentLocation.save();

                const currentSupervisor = await supervisorModel.findOne({ _id : arr[0] });
                currentSupervisor.locations.push(currentLocation._id);
                await currentSupervisor.save();

                const currentClient = await clientModel.findOne({ _id : currentLocation.client })
                .populate('locations')
                // .populate('experiences')

                return res.status(200).json({ success : true, message : "Location Updated", currentClient});
            }

            const currentClient1 = await clientModel.findOne({
                _id : client_id
            });

            
            const newLocation = await clientlocationModel.create({
                name, contact, state, location, email, client : currentClient1._id, supervisor : arr[0]
            });

            
            currentClient1.locations.push(newLocation._id);
            await currentClient1.save();

            const currentSupervisor = await supervisorModel.findOne({ _id : arr[0] });
            currentSupervisor.locations.push(newLocation._id);
            await currentSupervisor.save();

            const currentClient = await clientModel.findOne({
                _id : client_id
            })
            .populate('locations')
            // .populate('experiences')

            return res.status(200).json({
                success : true,
                message : "Location Added",
                currentClient
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: "plz try again later"
            })
        }
    })
    router.post("/user/delete_location", auth, async(req, res) => {

        const { uid, client_id, supervisor_id } = req.body;
       

        try{
            const previousSupervisor = await supervisorModel.findOne({ _id : supervisor_id });
            const index = previousSupervisor.locations.indexOf(uid);
            
            if(index > -1){
                previousSupervisor.locations.splice(index, 1);
                await previousSupervisor.save();
            }

            const currentLocation = await clientlocationModel.deleteOne({ _id : uid });
            

            const currentClient = await clientModel.findOne({ _id : client_id })
            .populate("locations")
            // .populate('experiences')
            // currentEducation.deleteOne();

            return res.status(200).json({ message : "location deleted", success : true, currentClient});
        }catch(err){
            return res.status(500).json({ message : "internal server error", success : false});
        }
    })

    router.post("/establisment/hiring_post", auth, async(req, res) => {

        const {client, no_of_hiring, state, location, skill, job_category, client_id, location_id} = req.body;

        const arr = client.split(",");
        let client_name = arr[1];
        try{
            const newHiring = await hiringModel.create({
                client_name,
                client_id,
                skill,
                no_of_hiring,
                state,
                location,
                establisment : req.user.id,
                job_category,
                location_id
            })
            const currentEstablisment1 = await adminModel.findOne({ _id : req.user.id})
            currentEstablisment1.hirings.push(newHiring._id);
            await currentEstablisment1.save();

            const currentClient = await clientModel.findOne({ _id : client_id});
            currentClient.hirings.push(newHiring._id);
            await currentClient.save();

            const currentLocation = await clientlocationModel.findOne({ _id : location_id});
            currentLocation.hirings.push(newHiring._id);
            await currentLocation.save();
            
            const currentEstablisment = await adminModel.findOne({ _id : req.user.id})
            .populate('hirings')

            res.status(200).json({ success : true, message : "Hiring Posted", currentEstablisment});
        }catch(err){
            res.status(500).json({ success : false, message : "internal server error"})
        }
    })

    router.get("/supervisor/hirings", auth, async(req, res) => {
        
        try{
            currentSupervisor = await supervisorModel.findOne({ _id : req.user.id });

            const users = await userModel.find({}, {aadhar_number:1, full_Name : 1, contact : 1},);
            
            
            const currentEstablisment = await adminModel.findOne({ _id : currentSupervisor.establisment})
            .populate('hirings')

            const supervisorLocations = currentSupervisor.locations;
            const totalHirings = currentEstablisment.hirings;
            let requiredHirings = [];

            
            for(let i=0; i<supervisorLocations.length; i++){
                for(let j=0; j<totalHirings.length; j++){
                    if(supervisorLocations[i].equals(totalHirings[j].location_id)){
                        requiredHirings.push(totalHirings[j]);
                    }
                }
            }

            res.status(200).json({ success : true, requiredHirings, users});
        }
        catch(e){
            res.status(500).json({ success : false, message : "Interna Server Error"});
        }
    })

    router.get("/establisment/hirings", auth, async(req, res) => {
        
        try{
            const currentEstablisment = await adminModel.findOne({ _id : req.user.id })
            .populate('hirings')

            res.status(200).json({ success : true, currentEstablisment});
        }
        catch(e){
            res.status(500).json({ success : false, message : "Interna Server Error"});
        }
    })

    router.post("/establisment/supervisor_edit", auth, async(req, res) => {
        try{
            const {_id, name, email, password, contact} = req.body;
        
            const currentSupervisor = await supervisorModel.findOne({_id});
            
            currentSupervisor.name = name;
            currentSupervisor.email = email;
            currentSupervisor.contact = contact;
            currentSupervisor.password = password;

            await currentSupervisor.save();

            const currentEstablisment = await adminModel.findOne({
                _id : req.user.id
              })
              .populate('supervisors');

            res.status(200).json({message : "Supervisor Edited", success : true, currentEstablisment});
        }
        catch(e){
            res.status(500).json({message : "Internal Server Error", success : false});
        }
    })

    router.post("/establisment/client_edit", auth, async(req, res) => {
        try{
            const {_id, name, email, password, contact} = req.body;
        
            const currentClient = await clientModel.findOne({_id});
            
            currentClient.name = name;
            currentClient.email = email;
            currentClient.contact = contact;
            currentClient.password = password;

            await currentClient.save();

            const currentEstablisment = await adminModel.findOne({
                _id : req.user.id
              })
              .populate('clients');

            res.status(200).json({message : "Client Edited", success : true, currentEstablisment});
        }
        catch(e){
            res.status(500).json({message : "Internal Server Error", success : false});
        }
    })

    router.post("/supervisor/hire", auth, async(req, res) => {
        const { user_id, hiring_id } = req.body;
        try{
            const currentUser = await userModel.findOne({_id : user_id},{_id : 1, hired : 1, job : 1, establisment : 1, employeeId : 1});

            if(currentUser.job){
                return res.status(400).json({ success : false, message : "user has already has a job"})
            }
            const currentSupervisor = await supervisorModel.findOne({_id : req.user.id}, {_id : 1, hired : 1, establisment : 1, locations : 1});
            
            const currentHiring = await hiringModel.findOne({_id : hiring_id}, {_id : 1, hired : 1, no_of_hired : 1});

            
            // Find the last hired user by employeeId in descending order
            const lastHired = await userModel.findOne().sort({ employeeId: -1 });
            let newEmployeeId = 1001; // Default starting employeeId
    
            // Increment the last user's ID if a user exists
            if (lastHired && lastHired.employeeId) {
                newEmployeeId = lastHired.employeeId + 1;
            }
    

            const newHired = await hiredModel.create({
                hiring_id,
                user_id,
                supervisor_id : req.user.id,
                establishment_id : currentSupervisor.establisment,
                employeeId : newEmployeeId
            });


            currentUser.job = true;
            currentUser.hired=newHired._id;
            currentUser.employeeId=newEmployeeId;
            currentUser.establisment = currentSupervisor.establisment;
            currentUser.supervisor = currentSupervisor._id;
            await currentUser.save();


            const temp = currentHiring.no_of_hired;
            currentHiring.hired.push(newHired._id);
            currentHiring.no_of_hired = temp+1;
            await currentHiring.save();

            currentSupervisor.hired.push(newHired._id);
            await currentSupervisor.save();

            const users = await userModel.find({}, {aadhar_number:1, full_Name : 1, contact : 1});
            
            const currentEstablisment = await adminModel.findOne({ _id : currentSupervisor.establisment},{ hirings : 1})
            .populate('hirings')


            const supervisorLocations = currentSupervisor.locations;
            const totalHirings = currentEstablisment.hirings;
            let requiredHirings = [];

            
            for(let i=0; i<supervisorLocations.length; i++){
                for(let j=0; j<totalHirings.length; j++){
                    if(supervisorLocations[i].equals(totalHirings[j].location_id)){
                        requiredHirings.push(totalHirings[j]);
                    }
                }
            }

            res.status(200).json({ success : true, message : "Hired Successfully..", requiredHirings, users});      
        }
        catch(err){
            res.status(500).json({success : false, message : "Internal Server Error"});
        }
    })

    router.get("/jobdashboard", auth, async (req, res) => {
        try {
            const Hirings = await hiringModel.find({})
                .populate('establisment', { _id: 1, name : 1 }) // Ensure the correct field name is used
                .populate('location_id'); // Ensure this field is correct in the schema

            const currentUser = await userModel.findOne({_id : req.user.id}, {job : 1});
     
            res.status(200).json({ message: "Hiring data fetched successfully", success: true, Hirings, currentUser });
        } catch (e) {// Log the error to debug
            res.status(500).json({ message: "Internal Server Error", success: false });
        }
    });


    // router.post('/upload/profile-pic', uploadImage.single('profilePic'), auth, async (req, res) => {
    //     try {
    //       const user = await userModel.findOne({ _id: req.user.id });
    //       if (!user) return res.status(404).json({ msg: 'User not found' });
      
    //       user.profilePic = `/uploads/${req.file.filename}`;
    //       await user.save();
      
    //       res.json({ msg: 'Profile picture updated', user });
    //     } catch (error) {
    //       res.status(500).json({ msg: 'Server error', error });
    //       console.log(error);
    //     }
    // });


    router.post('/upload/profile-pic', uploadImage.single('image'), auth, async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    success: false,
                    message: 'No image file provided' 
                });
            }

            const user = await userModel.findOneAndUpdate(
                { _id: req.user.id },
                { profilePic: `/uploads/${req.file.filename}` },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: 'User not found' 
                });
            }

            return res.status(200).json({ 
                success: true,
                message: 'Profile picture updated successfully',
                user 
            });

        } catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Server error',
                error: error.message 
            });
        }
    });
      

    router.post('/upload/file1', uploadPDF.single('file1'), auth, async (req, res) => {
        try {

            const userId = req.body.userId;
            const user = await userModel.findOne({ _id: userId }, {_id : 1, hired : 1, file1 : 1})
            .populate('hired')

            if (!user) return res.status(404).json({ msg: 'User not found' });
      
          user.file1 = `/uploads/${req.file.filename}`; // Save the file path
          user.hired.file1 = `/uploads/${req.file.filename}`;
          await user.save();
      
          res.json({ msg: 'file1 updated' });
        } catch (error) {
          res.status(500).json({ msg: 'Server error' });
        }
    });

    router.post('/upload/file2', uploadPDF.single('file2'), auth, async (req, res) => {
        try {

            const userId = req.body.userId;
            const user = await userModel.findOne({ _id: userId }, {_id : 1, file2 : 1, hired : 1})
            .populate('hired');

            if (!user) return res.status(404).json({ msg: 'User not found' });
      
          user.file2 = `/uploads/${req.file.filename}`; // Save the file path
          user.hired.file2 = `/uploads/${req.file.filename}`;

          await user.save();
      
          res.json({ msg: 'file2 updated' });
        } catch (error) {
          res.status(500).json({ msg: 'Server error' });
        }
    });


    router.get('/supervisor/hired', auth, async(req, res) => {
        try{
            const hiredList = await userModel.find({job : true, date_of_joining_status : false})
            .populate('hired');

            const currentSupervisor = await supervisorModel.findOne({_id : req.user.id}, {_id : 1});
            let totalHired = [];

            for(let i=0; i<hiredList.length; i++){
                if(hiredList[i].hired.supervisor_id.equals(currentSupervisor._id)){
                    totalHired.push(hiredList[i]);
                }
            }

            res.status(200).json({message : 'hired List fetched', success : true, totalHired});
        }
        catch(e){
            res.status(500).json({message : 'Internal server error', success : false});
        }
    })

    router.post('/supervisor/assign-date-of-joining', auth, async (req, res) => {
        try {
            const { dateOfJoining, chooseUser } = req.body;

    
            // Find the last hired user by employeeId in descending order
            const lastHired = await userModel.findOne().sort({ employeeId: -1 });
            let newEmployeeId = 1001; // Default starting employeeId
    
            // Increment the last user's ID if a user exists
            if (lastHired && lastHired.employeeId) {
                newEmployeeId = lastHired.employeeId + 1;
            }

    
            // Find the user to whom we are assigning the date of joining
            const currentUser = await userModel.findOne({ _id: chooseUser }, { date_of_joining_status: 1, date_of_joining: 1, hired: 1 })
                .populate('hired');
    
            if (!currentUser) {
                return res.status(404).json({ message: 'User not found', success: false });
            }

    
            // Assign date of joining and employee ID, then save
            currentUser.date_of_joining = dateOfJoining;
            currentUser.date_of_joining_status = true;
            // currentUser.employeeId = newEmployeeId;
            await currentUser.save();

    
            // Find all users who are hired but have not been assigned a date of joining
            const hiredList = await userModel.find({ job: true, date_of_joining_status: false })
                .populate('hired');
    
            // Find the current supervisor and get only their ID
            const currentSupervisor = await supervisorModel.findOne({ _id: req.user.id }, { _id: 1 });
            let totalHired = [];
    
            // Filter hiredList for users supervised by the current supervisor
            if (currentSupervisor) {
                totalHired = hiredList.filter(hiredUser => hiredUser.hired && hiredUser.hired.supervisor_id.equals(currentSupervisor._id));
            }
    
            // Return response with the updated list of hired users
            res.status(200).json({ message: "Date of Joining Assigned", success: true, totalHired });
        } catch (error) {
            // Catch and return error message in case of any server error
            res.status(500).json({ message: 'Internal Server Error', success: false });
        }
    });
    

    router.get('/establishment/pending-pf-esic', auth, async(req, res) => {
        try{
            const pfEsic = await userModel.find({wages_status : true, pf_esic_status : false})
            .populate('hired');

            const currentEstablishment = await adminModel.findOne({_id : req.user.id}, {_id : 1});
            let pendingPfEsic = [];

            for(let i=0; i<pfEsic.length; i++){
                if(pfEsic[i].hired.establishment_id.equals(currentEstablishment._id)){
                    pendingPfEsic.push(pfEsic[i]);
                }
            }
            res.status(200).json({message : 'pending PF/ESIC List fetched', success : true, pendingPfEsic});
        }
        catch(e){
            res.status(500).json({message : 'Internal server error', success : false});
        }
    })

    router.get('/supervisor/pending-pf-esic', auth, async(req, res) => {
        try{
            const pfEsic = await userModel.find({wages_status : true, pf_esic_status : false})
            .populate('hired');

            const currentSupervisor = await supervisorModel.findOne({_id : req.user.id}, {_id : 1});
            let pendingPfEsic = [];

            for(let i=0; i<pfEsic.length; i++){
                if(pfEsic[i].hired.supervisor_id.equals(currentSupervisor._id)){
                    pendingPfEsic.push(pfEsic[i]);
                }
            }
            res.status(200).json({message : 'pending PF/ESIC List fetched', success : true, pendingPfEsic});
        }
        catch(e){
            res.status(500).json({message : 'Internal server error', success : false});
        }
    })

    router.get('/establishment/pending-wages', auth, async(req, res) => {
        try{
            const wages = await userModel.find({date_of_joining_status : true, wages_status : false})
            .populate('hired');

            const currentEstablishment = await adminModel.findOne({_id : req.user.id}, {_id : 1});
            let pendingWages = [];

            for(let i=0; i<wages.length; i++){
                if(wages[i].hired.establishment_id.equals(currentEstablishment._id)){
                    pendingWages.push(wages[i]);
                }
            }

            res.status(200).json({message : 'pending Wages List fetched', success : true, pendingWages});
        }
        catch(e){
            res.status(500).json({message : 'Internal server error', success : false});
        }
    })

    router.get('/supervisor/pending-wages', auth, async(req, res) => {
        try{
            const wages = await userModel.find({date_of_joining_status : true, wages_status : false})
            .populate('hired');

            const currentSupervisor = await supervisorModel.findOne({_id : req.user.id}, {_id : 1});
            let pendingWages = [];

            for(let i=0; i<wages.length; i++){
                if(wages[i].hired.supervisor_id.equals(currentSupervisor._id)){
                    pendingWages.push(wages[i]);
                }
            }

            res.status(200).json({message : 'pending Wages List fetched', success : true, pendingWages});
        }
        catch(e){
            res.status(500).json({message : 'Internal server error', success : false});
        }
    })

    router.get('/establishment/active-users', auth, async(req, res) => {
        try{
            const users = await userModel.find({active_user_status : true})
            .populate('hired');

            const currentEstablishment = await adminModel.findOne({_id : req.user.id}, {_id : 1});
            let activeUsers = [];

            for(let i=0; i<users.length; i++){
                if(users[i].hired.establishment_id.equals(currentEstablishment._id)){
                    activeUsers.push(users[i]);
                }
            }

            res.status(200).json({message : 'Active Users List fetched', success : true, activeUsers});
        }
        catch(e){
            res.status(500).json({message : 'Internal server error', success : false});
        }
    })

    router.get('/supervisor/active-users', auth, isSupervisor, async(req, res) => {
        try{
            const users = await userModel.find({active_user_status : true})
            .populate('hired');

            const currentSupervisor = await supervisorModel.findOne({_id : req.user.id}, {_id : 1});
            let activeUsers = [];

            for(let i=0; i<users.length; i++){
                if(users[i].hired.supervisor_id.equals(currentSupervisor._id)){
                    activeUsers.push(users[i]);
                }
            }

            res.status(200).json({message : 'Active Users List fetched', success : true, activeUsers});
        }
        catch(e){
            res.status(500).json({message : 'Internal server error', success : false});
        }
    })

    router.post('/establishment/save-wages', auth, async(req, res) => {
        try{
            const { user_id, basic, da, hra, other_allowance, leave_with_wages} = req.body;
            const currentUser = await userModel.findOne({_id : user_id}, {basic : 1, da : 1, hra : 1, other_allowance : 1, leave_with_wages : 1, wages_status : 1, hired : 1})
            .populate('hired');


            currentUser.basic = basic;
            currentUser.da = da;
            currentUser.hra = hra;
            currentUser.other_allowance = other_allowance;
            currentUser.leave_with_wages = leave_with_wages;
            currentUser.wages_status = true;

            currentUser.hired.basic = basic;
            currentUser.hired.da = da;
            currentUser.hired.hra = hra;
            currentUser.hired.other_allowance = other_allowance;
            currentUser.hired.leave_with_wages = leave_with_wages;
            currentUser.hired.wages_status = true;
            await currentUser.save();
            
            const wages = await userModel.find({date_of_joining_status : true, wages_status : false})
            .populate('hired');

            const currentEstablishment = await adminModel.findOne({_id : req.user.id}, {_id : 1});
            let pendingWages = [];

            for(let i=0; i<wages.length; i++){
                if(wages[i].hired.establishment_id.equals(currentEstablishment._id)){
                    pendingWages.push(wages[i]);
                }
            }

            res.status(200).json({success : true, message : "Wages Saved", pendingWages});
        }
        catch(err){
            res.status(500).json({ success : false, message : "Internal Server Error"});
        }
    })

    router.post('/supervisor/save-wages', auth, async(req, res) => {
        try{
            const { user_id, basic, da, hra, other_allowance, leave_with_wages} = req.body;
            const currentUser = await userModel.findOne({_id : user_id}, {basic : 1, da : 1, hra : 1, other_allowance : 1, leave_with_wages : 1, wages_status : 1, hired : 1})
            .populate('hired');


            currentUser.basic = basic;
            currentUser.da = da;
            currentUser.hra = hra;
            currentUser.other_allowance = other_allowance;
            currentUser.leave_with_wages = leave_with_wages;
            currentUser.wages_status = true;

            currentUser.hired.basic = basic;
            currentUser.hired.da = da;
            currentUser.hired.hra = hra;
            currentUser.hired.other_allowance = other_allowance;
            currentUser.hired.leave_with_wages = leave_with_wages;
            currentUser.hired.wages_status = true;
            await currentUser.save();
            
            const wages = await userModel.find({date_of_joining_status : true, wages_status : false})
            .populate('hired');

            const currentSupervisor = await supervisorModel.findOne({_id : req.user.id}, {_id : 1});
            let pendingWages = [];

            for(let i=0; i<wages.length; i++){
                if(wages[i].hired.supervisor_id.equals(currentSupervisor._id)){
                    pendingWages.push(wages[i]);
                }
            }

            res.status(200).json({success : true, message : "Wages Saved", pendingWages});
        }
        catch(err){
            res.status(500).json({ success : false, message : "Internal Server Error"});
        }
    })

    router.post('/establishment/save-pf-esic', auth, async(req, res) => {
        try{
            const { user_id, uan_number, epf_number, esi_number} = req.body;
            const currentUser = await userModel.findOne({_id : user_id}, {uan_number : 1, epf_number : 1, esi_number : 1, pf_esic_status : 1, hired : 1, active_user_status : 1})
            .populate('hired');


            currentUser.uan_number = uan_number;
            currentUser.epf_number = epf_number;
            currentUser.esi_number = esi_number;
            currentUser.pf_esic_status = true;
            currentUser.active_user_status = true;


            currentUser.hired.uan_number = uan_number;
            currentUser.hired.epf_number = epf_number;
            currentUser.hired.esi_number = esi_number;
            currentUser.hired.pf_esic_status = true;
            currentUser.hired.active_user_status = true;
            await currentUser.save();

            const pfEsic = await userModel.find({wages_status : true, pf_esic_status : false})
            .populate('hired');

            const currentEstablishment = await adminModel.findOne({_id : req.user.id}, {_id : 1});
            let pendingPfEsic = [];

            for(let i=0; i<pfEsic.length; i++){
                if(pfEsic[i].hired.establishment_id.equals(currentEstablishment._id)){
                    pendingPfEsic.push(pfEsic[i]);
                }
            }

            res.status(200).json({success : true, message : "PF/ESIC Saved", pendingPfEsic});
        }
        catch(err){
            res.status(500).json({ success : false, message : "Internal Server Error"});
        }
    })

    router.post('/supervisor/save-pf-esic', auth, async(req, res) => {
        try {
            // Input validation
            const { user_id, uan_number, epf_number, esi_number } = req.body;
            
            if (!user_id || !uan_number || !epf_number || !esi_number) {
                return res.status(400).json({ 
                    success: false, 
                    message: "All fields (user_id, uan_number, epf_number, esi_number) are required" 
                });
            }

            // Find and validate user
            const currentUser = await userModel.findOne({ _id: user_id })
                .populate('hired');

            if (!currentUser) {
                return res.status(404).json({ 
                    success: false, 
                    message: "User not found" 
                });
            }

            if (!currentUser.hired) {
                return res.status(400).json({ 
                    success: false, 
                    message: "User is not hired" 
                });
            }

            // Update user data
            currentUser.uan_number = uan_number;
            currentUser.epf_number = epf_number;
            currentUser.esi_number = esi_number;
            currentUser.pf_esic_status = true;
            currentUser.active_user_status = true;

            // Update hired data
            currentUser.hired.uan_number = uan_number;
            currentUser.hired.epf_number = epf_number;
            currentUser.hired.esi_number = esi_number;
            currentUser.hired.pf_esic_status = true;
            currentUser.hired.active_user_status = true;

            // Save both documents
            await Promise.all([
                currentUser.save(),
                currentUser.hired.save()
            ]);

            // Get pending PF/ESIC users for current supervisor
            const currentSupervisor = await supervisorModel.findOne({ _id: req.user.id }, {_id : 1});
            if (!currentSupervisor) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Supervisor not found" 
                });
            }

            const pfEsic = await userModel.find({ 
                wages_status: true, 
                pf_esic_status: false 
            }).populate('hired');

            const pendingPfEsic = pfEsic.filter(user => 
                user.hired && user.hired.supervisor_id.equals(currentSupervisor._id)
            );

            res.status(200).json({ 
                success: true, 
                message: "PF/ESIC details saved successfully", 
                pendingPf_Esic: pendingPfEsic 
            });
        }
        catch (err) {
            console.error('Error in save-pf-esic:', err);
            res.status(500).json({ 
                success: false, 
                message: err.message || "An error occurred while saving PF/ESIC details" 
            });
        }
    });

    router.get('/establishment/employee-detail', auth, async(req, res) => {
        try{

        }catch(err){
            res.status(500).json({ message : 'Internal Server Error', })
        }
    })

    router.post('/establishment/register-user', auth, async(req, res) => {
        try{
            const { registerData, panData } = req.body;
            const existingUser = await userModel.findOne({ email : registerData.email })
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    Message: "Email already exists as user"
                })
            }

            const existingAdmin = await adminModel.findOne({ email : registerData.email })
            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    Message: "Email already exists as establisment"
                })
            }


            const existingClient = await clientModel.findOne({ email : registerData.email })
            if (existingClient) {
                return res.status(400).json({
                    success: false,
                    Message: "Email already exists as client"
                })
            }

            const existingSupervisor = await supervisorModel.findOne({ email : registerData.email })
            if (existingSupervisor) {
                return res.status(400).json({
                    success: false,
                    Message: "Email already exists as supervisor"
                })
            }

            const existingPan = await userModel.findOne({ pan_number : registerData.pan_number })
            if (existingPan) {
                return res.status(400).json({
                    success: false,
                    Message: "Pan already exists"
                })
            }
            
            let pass1 = registerData.fullName.slice(0, 4).toUpperCase(); // First 4 letters of fullName
            let pass2 = registerData.aadhar_no.slice(-4); // Last 4 digits of aadhar_no
            let newPassword = `${pass1}${pass2}`; // Combine both
            
            let hashedPassword;
            try {
                hashedPassword = await bcrypt.hash(newPassword, 10); // Corrected bcrypt spelling
            } catch (e) {
                return res.status(500).json({
                    success: false,
                    message: "nahi hua hash"
                })
            }
            
            const newUser = await userModel.create({
                full_Name : registerData.fullName,
                email : registerData.email,
                password: hashedPassword, 
                contact : registerData.contact,
                aadhar_number : registerData.aadhar_no,
                country : panData.address.country,
                loc : panData.address.line_2,
                state : panData.address.state,
                street : panData.address.street_name,
                dob : registerData.dob,
                gender : panData.gender,
                zip : panData.address.zip,
                establisment : req.user.id,
                pan_number : registerData.pan_number,
                pan_name : panData.full_name,
                pan_added : true
            });

            const users = await userModel.find({establisment : req.user.id});

            return res.status(200).json({
                success: true,
                message: "user created successfully",
                users
            })

        }catch(e){
            res.status(500).json({message : 'Internal Server Error', success : false});
        }
    })

    router.get('/establishment/users', auth, async(req, res) => {
        try{
            const users = await userModel.find({establisment : req.user.id});

            
            res.status(200).json({ message : 'User Data Fetched', success : true, users});
        }
        catch(e){
            res.status(500).json({ message : 'Internal Server Error', success : false});
        }
    })

    router.post('/establishmant/employee-detail', auth, async(req, res) => {
        const user = req.body;
        try{    
            const currentUser = await userModel.findOne({_id : user.userId})
            .populate('hired')
            .populate('qualifications')
            .populate('experiences')


            res.status(200).json({ message : 'user fetched', success : true, currentUser});
        }catch(err){
            res.status(500).json({ message : "Internal Server Error", success : false});
        }
    })

    router.get('/supervisor/profile', auth, async(req, res) => {
        try{
            const currentSupervisor = await supervisorModel.findOne({ _id : req.user.id })

            res.status(200).json({ message : 'fetched', success: true, currentSupervisor});
        }
        catch(err){
            res.status(500).json({ message : 'Internal Server Error', success : false});
        }
    })

    router.get('/client/profile', auth, async(req, res) => {
        try{
            const currentClient = await clientModel.findOne({ _id : req.user.id })

            res.status(200).json({ message : 'fetched', success: true, currentClient});
        }
        catch(err){
            res.status(500).json({ message : 'Internal Server Error', success : false});
        }
    })


    router.post('/checking', async(req, res) => {
        try{
            const { email } = req.body;
            const currentUser = await userModel.findOne({email});

            currentUser.wages_status = false;
            await currentUser.save();

            res.send("done");
        }
        catch(e){
            console.log(e);
        }
    })

    router.get('/checking', async(req, res) => {
        
        try{
            // const { email } = req.body;
            // const currentUser = await userModel.findOne({email});

            // currentUser.date_of_joining_status = false;
            // await currentUser.save();

            res.send("done");
        }
        catch(e){
            console.log(e);
        }
    })

    router.post('/upload/pan-image', uploadImageAndPdf.single('image'), auth, async (req, res) => {
        try {
            const user = await userModel.findOneAndUpdate(
                { _id: req.user.id },
                { pan_image: `/uploads/${req.file.filename}` },
                { new: true, runValidators: false } // Disable validation for this update
            );

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        
            res.json({ msg: 'Pan card image uploaded successfully', user });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    router.post('/upload/aadhar-image', uploadImageAndPdf.single('image'), auth, async (req, res) => {
        try {
            const user = await userModel.findOneAndUpdate(
                { _id: req.user.id },
                { aadhar_image: `/uploads/${req.file.filename}` },
                { new: true, runValidators: false } // Disable validation for this update
            );

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        
            res.json({ msg: 'Aadhar card image uploaded successfully', user });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    router.post('/delete/pan-image', auth, async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.user.id });
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        
            // Delete the file from uploads folder if needed
            if (user.pan_image) {
                const filePath = path.join(__dirname, '..', 'public', user.pan_image);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        
            user.pan_image = null;
            await user.save();
        
            res.json({ msg: 'Pan card image deleted successfully', user });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    router.post('/delete/aadhar-front-image', auth, async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.user.id });
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        
            // Delete the file from uploads folder if needed
            if (user.aadhar_front_image) {
                const filePath = path.join(__dirname, '..', 'public', user.aadhar_front_image);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        
            user.aadhar_front_image = null;
            await user.save();
        
            res.json({ msg: 'Aadhar card front image deleted successfully', user });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    router.post('/delete/aadhar-back-image', auth, async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.user.id });
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        
            // Delete the file from uploads folder if needed
            if (user.aadhar_back_image) {
                const filePath = path.join(__dirname, '..', 'public', user.aadhar_back_image);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        
            user.aadhar_back_image = null;
            await user.save();
        
            res.json({ msg: 'Aadhar card back image deleted successfully', user });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    // Add this route for certificate upload
    router.post('/upload/certificate', uploadImageAndPdf.single('certificate'), auth, async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.user.id });
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            const { id, type } = req.body;
            const Model = type === 'experience' ? experienceModel : educationModel;
            
            const entry = await Model.findById(id);
            if (!entry) {
                return res.status(404).json({ msg: `${type} entry not found` });
            }

            // Delete old certificate if exists
            if (entry.certificate) {
                const oldPath = path.join(__dirname, '..', 'public', entry.certificate);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            entry.certificate = `/uploads/${req.file.filename}`;
            await entry.save();

            // Get updated user data
            const updatedUser = await userModel.findOne({ _id: req.user.id })
                .populate('qualifications')
                .populate('experiences');

            res.json({ msg: 'Certificate uploaded successfully', user: updatedUser });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    // Add this route for certificate deletion
    router.post('/delete/certificate', auth, async (req, res) => {
        try {
            const { id, type } = req.body;
            const Model = type === 'experience' ? experienceModel : educationModel;
            
            const entry = await Model.findById(id);
            if (!entry) {
                return res.status(404).json({ msg: `${type} entry not found` });
            }

            // Delete the file
            if (entry.certificate) {
                const filePath = path.join(__dirname, '..', 'public', entry.certificate);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            entry.certificate = null;
            await entry.save();

            // Get updated user data
            const updatedUser = await userModel.findOne({ _id: req.user.id })
                .populate('qualifications')
                .populate('experiences');

            res.json({ msg: 'Certificate deleted successfully', user: updatedUser });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    // Add account image upload route
    router.post('/upload/account-image', uploadImageAndPdf.single('image'), auth, async (req, res) => {
        try {
            const user = await userModel.findOneAndUpdate(
                { _id: req.user.id },
                { account_image: `/uploads/${req.file.filename}` },
                { new: true, runValidators: false }
            );

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        
            res.json({ msg: 'Account image uploaded successfully', user });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    // Add account image delete route
    router.post('/delete/account-image', auth, async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.user.id });
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        
            // Delete the file from uploads folder if needed
            if (user.account_image) {
                const filePath = path.join(__dirname, '..', 'public', user.account_image);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        
            user.account_image = null;
            await user.save();
        
            res.json({ msg: 'Account image deleted successfully', user });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    // Add these routes for Aadhar front and back image upload
    router.post('/upload/aadhar-front-image', uploadImageAndPdf.single('image'), auth, async (req, res) => {
        try {
            const user = await userModel.findOneAndUpdate(
                { _id: req.user.id },
                { aadhar_front_image: `/uploads/${req.file.filename}` },
                { new: true, runValidators: false }
            );

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        
            res.json({ msg: 'Aadhar front image uploaded successfully', user });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    router.post('/upload/aadhar-back-image', uploadImageAndPdf.single('image'), auth, async (req, res) => {
        try {
            const user = await userModel.findOneAndUpdate(
                { _id: req.user.id },
                { aadhar_back_image: `/uploads/${req.file.filename}` },
                { new: true, runValidators: false }
            );

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        
            res.json({ msg: 'Aadhar back image uploaded successfully', user });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    });

    // Add this route for establishment profile picture upload
    router.post('/establishment/upload-profile-pic', uploadImage.single('image'), auth, async (req, res) => {
        try {
            const establishment = await adminModel.findOneAndUpdate(
                { _id: req.user.id },
                { profilePic: `/uploads/${req.file.filename}` },
                { new: true, runValidators: false }
            );

            if (!establishment) {
                return res.status(404).json({
                    success: false,
                    message: 'Establishment not found'
                });
            }

            res.json({
                success: true,
                message: 'Profile picture updated successfully',
                establishment
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update profile picture',
                error: error.message
            });
        }
    });

    // Add this route for establishment profile update
    router.post('/establishment/update-profile', auth, async (req, res) => {
        try {
            const { name, email, contact, address, registration_number, gst_number } = req.body;

            // Check if email already exists for other establishments
            if (email !== req.user.email) {
                const existingEstablishment = await adminModel.findOne({ 
                    email, 
                    _id: { $ne: req.user.id } 
                });
                
                if (existingEstablishment) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already exists'
                    });
                }
            }

            const establishment = await adminModel.findOneAndUpdate(
                { _id: req.user.id },
                { 
                    name,
                    email,
                    contact,
                    address,
                    registration_number,
                    gst_number
                },
                { new: true, runValidators: true }
            );

            if (!establishment) {
                return res.status(404).json({
                    success: false,
                    message: 'Establishment not found'
                });
            }

            res.json({
                success: true,
                message: 'Profile updated successfully',
                establishment
            });
        } catch (error) {
            console.error('Update error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: error.message
            });
        }
    });

    // Add logo upload route
    router.post('/establishment/upload-logo', uploadImage.single('logo'), auth, async (req, res) => {
        try {
            const establishment = await adminModel.findOneAndUpdate(
                { _id: req.user.id },
                { logo: `/uploads/${req.file.filename}` },
                { new: true, runValidators: false }
            );

            if (!establishment) {
                return res.status(404).json({
                    success: false,
                    message: 'Establishment not found'
                });
            }

            res.json({
                success: true,
                message: 'Logo updated successfully',
                establishment
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update logo',
                error: error.message
            });
        }
    });

    // Add logo delete route
    router.post('/establishment/delete-logo', auth, async (req, res) => {
        try {
            const establishment = await adminModel.findOne({ _id: req.user.id });
            
            if (!establishment) {
                return res.status(404).json({
                    success: false,
                    message: 'Establishment not found'
                });
            }

            // Delete the physical file if it exists
            if (establishment.logo) {
                const filePath = path.join(__dirname, '..', 'public', establishment.logo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            // Update the establishment document using findOneAndUpdate
            const updatedEstablishment = await adminModel.findOneAndUpdate(
                { _id: req.user.id },
                { $set: { logo: null } },
                { new: true }
            );

            res.json({
                success: true,
                message: 'Logo removed successfully',
                establishment: updatedEstablishment
            });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to remove logo',
                error: error.message
            });
        }
    });

    // Signature routes
    router.post('/upload/signature', auth, uploadImage.single('image'), uploadSignature);
    router.post('/delete/signature', auth, deleteSignature);

    router.get('/leave-page/user-data', auth, isUser, leavePageData);
    router.post('/leave-page/leave-application', auth, isUser, leaveApplication);

module.exports = router