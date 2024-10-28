const express = require("express")
const router = express.Router();
const bcrypt = require('bcrypt');
const adminModel = require("../models/admin.js");
const superadminModel = require("../models/superadmin.model.js");
const userModel = require("../models/user.js");
const requestModel = require("../models/request.js")
const batchModel = require("../models/batch.model.js")
const trainerModel = require("../models/trainer.model.js")
const trainingModel = require("../models/subject.model.js")
const classModel = require("../models/class.model.js")
const educationModel = require("../models/education.model.js")
const experienceModel = require("../models/experience.model.js")
const clientlocationModel = require("../models/clientlocation.model.js")
const hiringModel = require("../models/hiring.model.js")
const hiredModel = require("../models/hired.model.js");
const { uploadImage } = require('../middleware/multer.js');
const { uploadPDF } = require('../middleware/multer.js');
const path = require('path');



const { userlogin, usersignup, adminsignup, adminlogin, clientregister, clientlogin, supervisorlogin, supervisorregister, superadminlogin, superadminsignup } = require("../controller/auth")

const { auth, isStudent, isAdmin, isSuperadmin } = require("../middleware/auth");
const clientModel = require("../models/client.model.js");
const supervisorModel = require("../models/supervisor.model.js");


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



router.get("/user/profile",auth, async (req, res) => {

    // const requestHistory = await requestModel.find(req.user._id.equals(user));
   
    const currentUser = await userModel.findOne({ _id : req.user.id })
    .populate('qualifications')
    .populate('experiences')
    
    res.send(currentUser);
});

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
    })
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
                res.json({message : "Please Enter all the data", success : false});
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
        
        try{
            const { institute, degree, starting_month, starting_year, ending_month, ending_year, score, description, editId } = req.body;

            if(!institute || !degree || !starting_month || !starting_year || !ending_month || !ending_year || !score){
                res.json({message : "Please Enter all the data", success : false});
            }

            if(editId !== ''){
                const currentExperience = await experienceModel.findOne({ _id : editId });

                currentExperience.company = institute;
                currentExperience.role = degree;
                currentExperience.starting_month = starting_month;
                currentExperience.starting_year = starting_year;
                currentExperience.ending_month = ending_month;
                currentExperience.ending_year = ending_year;
                currentExperience.location = score;
                currentExperience.description = description;

                await currentExperience.save();

                const currentUser1 = await userModel.findOne({ _id : currentExperience.user })
                .populate('qualifications')
                .populate('experiences')

                return res.status(200).json({ success : true, message : "education Updated", currentUser1});
            }

            const currentUser = await userModel.findOne({
                _id : req.user.id
            });

            

            const newExperience = await experienceModel.create({
                company : institute, role : degree, starting_month, starting_year, ending_month, ending_year, location : score, description, user : currentUser._id
            });

            

            currentUser.experiences.push(newExperience._id);
            await currentUser.save();

            const currentUser1 = await userModel.findOne({
                _id : req.user.id
            })
            .populate('qualifications')
            .populate('experiences')

            return res.status(200).json({
                success : true,
                message : "Experience Added",
                currentUser1
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                message: "plz try again later"
            })
        }
    })

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
            const currentUser = await userModel.findOne({_id : user_id},{_id : 1, hired : 1, job : 1});

            if(currentUser.job){
                return res.status(400).json({ success : false, message : "user has already has a job"})
            }
            const currentSupervisor = await supervisorModel.findOne({_id : req.user.id}, {_id : 1, hired : 1, establisment : 1, locations : 1});
            

            const currentHiring = await hiringModel.findOne({_id : hiring_id}, {_id : 1, hired : 1, no_of_hired : 1});

            const newHired = await hiredModel.create({
                hiring_id,
                user_id,
                supervisor_id : req.user.id,
                establishment_id : currentSupervisor.establisment
            });

            currentUser.job = true;
            currentUser.hired=newHired._id;
            await currentUser.save();

            const temp = currentHiring.no_of_hired;
            currentHiring.hired.push(newHired._id);
            currentHiring.no_of_hired = temp+1;
            await currentHiring.save();

            currentSupervisor.hired.push(newHired._id);
            await currentSupervisor.save();

            const users = await userModel.find({}, {aadhar_number:1, full_Name : 1, contact : 1},);
            
            
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


    router.post('/upload/profile-pic', uploadImage.single('profilePic'), auth, async (req, res) => {
        try {
          const user = await userModel.findOne({ _id: req.user.id });
          if (!user) return res.status(404).json({ msg: 'User not found' });
      
          user.profilePic = `../uploads/${req.file.filename}`; // Save the file path
          await user.save();
      
          res.json({ msg: 'Profile picture updated', user });
        } catch (error) {
          res.status(500).json({ msg: 'Server error' });
        }
    });

    router.post('/upload/file1', uploadPDF.single('file1'), auth, async (req, res) => {
        try {

            const userId = req.body.userId;
            const user = await userModel.findOne({ _id: userId }, {_id : 1, hired : 1, file1 : 1})
            .populate('hired')

            if (!user) return res.status(404).json({ msg: 'User not found' });
      
          user.file1 = `../uploads/${req.file.filename}`; // Save the file path
          user.hired.file1 = `../uploads/${req.file.filename}`;
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
      
          user.file2 = `../uploads/${req.file.filename}`; // Save the file path
          user.hired.file2 = `../uploads/${req.file.filename}`;

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

    router.post('/supervisor/assign-date-of-joining', auth, async(req, res) => {
        try{
            const {dateOfJoining, chooseUser} = req.body;

            const lastHired = await userModel.findOne().sort({ employeeId: -1 });
            let newEmployeeId = 1001;

            if (lastHired) {
                newEmployeeId = lastHired.employeeId + 1; // Increment the last user's ID
            }

            const currentUser = await userModel.findOne({_id : chooseUser},{date_of_joining_status : 1, date_of_joining : 1, hired : 1})
            .populate('hired');

            currentUser.date_of_joining = dateOfJoining;
            currentUser.date_of_joining_status = true;
            currentUser.employeeId = newEmployeeId;
            await currentUser.save();

            const hiredList = await userModel.find({job : true, date_of_joining_status : false})
            .populate('hired');

            const currentSupervisor = await supervisorModel.findOne({_id : req.user.id}, {_id : 1});
            let totalHired = [];

            for(let i=0; i<hiredList.length; i++){
                if(hiredList[i].hired.supervisor_id.equals(currentSupervisor._id)){
                    totalHired.push(hiredList[i]);
                }
            }

            res.status(200).json({message : "Date of Joining Assigned", success : true, totalHired});
        }
        catch(e){
            res.status(500).json({ message : 'Internal Server Error', success : false});
        }
    })

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

    router.get('/supervisor/active-users', auth, async(req, res) => {
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

            const currentSupervisor = await supervisorModel.findOne({_id : req.user.id}, {_id : 1});
            let pendingPfEsic = [];

            for(let i=0; i<pfEsic.length; i++){
                if(pfEsic[i].hired.supervisor_id.equals(currentSupervisor._id)){
                    pendingPfEsic.push(pfEsic[i]);
                }
            }

            res.status(200).json({success : true, message : "PF/ESIC Saved", pendingPfEsic});
        }
        catch(err){
            res.status(500).json({ success : false, message : "Internal Server Error"});
        }
    })

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

module.exports = router