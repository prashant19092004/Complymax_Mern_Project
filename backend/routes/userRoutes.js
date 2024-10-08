const express = require("express")
const router = express.Router();
const adminModel = require("../models/admin.js");
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



const { userlogin, usersignup, adminsignup, adminlogin, clientregister, clientlogin, supervisorlogin, supervisorregister } = require("../controller/auth")

const { auth, isStudent, isAdmin } = require("../middleware/auth");
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


router.post("/addbatch", async(req, res) => {
    
    const { batchName, semester } = req.body;

    const batch = await batchModel.create({
        batch_name : batchName,
        semester
    })
})

router.get("/batches", async(req, res) => {
    const batchList = await batchModel.find();
    res.send(batchList); 
})

router.post("/update_status", async(req, res) => {
    const { id } = req.body;

    const batch = await batchModel.findOne({
        _id : id
    })

    batch.status = batch.status ? false : true ;
    await batch.save();

    const batchList = await batchModel.find();
    res.send(batchList); 
})

router.post("/addtrainer", async(req, res) => {
    
    const { trainerName, mob, address } = req.body;

    const trainer = await trainerModel.create({
        name : trainerName,
        mob,
        address
    })
})

router.get("/trainers", async(req, res) => {
    const trainersList = await trainerModel.find();
    res.send(trainersList); 
})

router.post("/addtraining", async(req, res) => {
    
    const { training_name, batch_id, trainer_id } = req.body;

    const training = await trainingModel.create({
        subject_name : training_name,
        batch : batch_id,
        trainer : trainer_id
    })

    const currentTrainer = await trainerModel.findOne({_id : trainer_id});

    currentTrainer.subject.push(training._id);
    await currentTrainer.save();

    const currentBatch = await batchModel.findOne({_id : batch_id});

    currentBatch.trainings.push(training._id);
    await currentBatch.save();
})

router.get("/trainings", async(req, res) => {
    const trainingsList = await trainingModel.find()
    .populate('batch')
    .populate('trainer')


    res.send(trainingsList); 
})

router.post("/searchtraining", async(req, res) => {

    const { uid } = req.body;

    const training = await trainingModel.findOne({ _id : uid })
    .populate('batch')
    .populate('trainer')


    res.send(training); 
})

router.post("/saveclass", async(req, res) => {

    const { trainer_id , topic, feedback, trainer_entry_hour, trainer_entry_minute, trainer_entry_shift, trainer_exit_hour, trainer_exit_minute, trainer_exit_shift, training_id } = req.body;

    const classData = await classModel.create({
        trainer_entry_hour,
        trainer_entry_minute,
        trainer_entry_shift,
        trainer_exit_hour,
        trainer_exit_minute,
        trainer_exit_shift,
        trainer : trainer_id,
        subject : training_id,
        class_topic : topic,
        feedback
    });

    const trainer = await trainerModel.findOne({ _id : trainer_id });
    const training = await trainingModel.findOne({ _id : training_id });
    
   
    // console.log(training);
    training.syllabus.push(topic);
    training.classes.push(classData._id);
    await training.save();


    res.send("class saved");
})


router.post("/gettraining", async(req, res) => {

    const { uid } = req.body;

    const training = await trainingModel.findOne({ _id : uid})
    .populate('classes')

    res.send(training);
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
    
    // console.log(currentEstablisment);
    res.send(currentEstablisment);
});

    router.get("/userdashboard",auth, async (req, res) => {

        // const requestHistory = await requestModel.find(req.user._id.equals(user));
        // console.log(req.user);
        const currentUser = await userModel.findOne({
            _id : req.user.id
          })
    
        // console.log(currentUser);
        res.send(currentUser);
    });

    router.get("/establisment/clientlist",auth, async (req, res) => {

            // const requestHistory = await requestModel.find(req.user._id.equals(user));
            // console.log(req.user);
            const currentEstablisment = await adminModel.findOne({
                _id : req.user.id
              })
              .populate('clients');
        
            // console.log(currentUser);
            res.send(currentEstablisment);
        });

        router.get("/establisment/supervisorlist",auth, async (req, res) => {

            // const requestHistory = await requestModel.find(req.user._id.equals(user));
            // console.log(req.user);
            const currentEstablisment = await adminModel.findOne({
                _id : req.user.id
              })
              .populate('supervisors');
        
            // console.log(currentUser);
            res.send(currentEstablisment);
        });


    router.post("/user/profile/add_Pan",auth, async(req, res) => {
        const { full_name, pan_number} = req.body;

        try{
            const currentUser = await userModel.findOne({ _id : req.user.id});

            if(currentUser.full_Name == full_name){
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

                currentUser.account_number = account_number;
                currentUser.account_name = data.full_name;
                currentUser.account_added = true;
                currentUser.account_ifsc = data.ifsc_details.ifsc;
                await currentUser.save();
                res.json({message : "PaAccount Added", success : true});
        }catch(err){
            res.json({message : "Account not Added", success : false});
        }
    })

    router.post("/establisment/client_data", async(req, res) => {
        console.log(req.body);
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
        console.log(req.body);
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
        // console.log(req.body);
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

            // console.log(newExperience);

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
        // console.log(req.body);

        try{
            const currentEducation = await educationModel.deleteOne({ _id : uid });
            // console.log(currentEducation);

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
        // console.log(req.body);

        try{
            const currentExperience = await experienceModel.deleteOne({ _id : uid });
            // console.log(currentExperience);

            const currentUser = await userModel.findOne({ _id : req.user.id })
            .populate("qualifications")
            .populate('experiences')
            // currentEducation.deleteOne();

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
                console.log(index);
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

            console.log(newLocation);
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
        console.log(req.body);

        try{
            const previousSupervisor = await supervisorModel.findOne({ _id : supervisor_id });
            const index = previousSupervisor.locations.indexOf(uid);
            console.log(index);
            if(index > -1){
                previousSupervisor.locations.splice(index, 1);
                await previousSupervisor.save();
            }

            const currentLocation = await clientlocationModel.deleteOne({ _id : uid });
            // console.log(currentEducation);

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
            
            // console.log(users);
            const currentEstablisment = await adminModel.findOne({ _id : currentSupervisor.establisment})
            .populate('hirings')

            const supervisorLocations = currentSupervisor.locations;
            const totalHirings = currentEstablisment.hirings;
            let requiredHirings = [];

            // console.log(supervisorLocations);
            // console.log(totalHirings);
            
            for(let i=0; i<supervisorLocations.length; i++){
                for(let j=0; j<totalHirings.length; j++){
                    if(supervisorLocations[i].equals(totalHirings[j].location_id)){
                        requiredHirings.push(totalHirings[j]);
                    }
                }
            }
            // console.log(requiredHirings);

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

    router.post("/establisment/supervisor_edit", async(req, res) => {
        try{
            const {_id, name, email, password, contact} = req.body;
        
            const currentSupervisor = await supervisorModel.findOne({_id});
            console.log(currentSupervisor);
            currentSupervisor.name = name;
            currentSupervisor.email = email;
            currentSupervisor.contact = contact;
            currentSupervisor.password = password;

            await currentSupervisor.save();

            res.status(200).json({message : "Supervisor Edited", success : true});
        }
        catch(e){
            res.status(500).json({message : "Internal Server Error", success : false});
        }
    })

    router.post("/establisment/client_edit", async(req, res) => {
        try{
            // console.log(req.body);
            const {_id, name, email, password, contact} = req.body;
        
            const currentClient = await clientModel.findOne({_id});
            // console.log(currentClient);
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
        // console.log(assignedUserId);
        try{
            const currentUser = await userModel.findOne({_id : user_id},{_id : 1, hired : 1});

            // console.log(req.user.id);
            const currentSupervisor = await supervisorModel.findOne({_id : req.user.id}, {_id : 1, hired : 1, establisment : 1, locations : 1});
            // console.log(currentSupervisor);

            const currentHiring = await hiringModel.findOne({_id : hiring_id}, {_id : 1, hired : 1, no_of_hired : 1});

            const newHired = await hiredModel.create({
                hiring_id,
                user_id,
                supervisor_id : req.user.id
            });

            // console.log("Hii");
            currentUser.hired.push(newHired._id);
            await currentUser.save();

            const temp = currentHiring.no_of_hired;
            currentHiring.hired.push(newHired._id);
            currentHiring.no_of_hired = temp+1;
            await currentHiring.save();

            currentSupervisor.hired.push(newHired._id);
            await currentSupervisor.save();

            const users = await userModel.find({}, {aadhar_number:1, full_Name : 1, contact : 1},);
            
            // console.log(users);
            const currentEstablisment = await adminModel.findOne({ _id : currentSupervisor.establisment},{ hirings : 1})
            .populate('hirings')

            // console.log(currentEstablisment);

            const supervisorLocations = currentSupervisor.locations;
            const totalHirings = currentEstablisment.hirings;
            let requiredHirings = [];

            // console.log(supervisorLocations);
            // console.log(totalHirings);
            
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

module.exports = router