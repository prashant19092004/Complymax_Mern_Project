const User = require("../models/user") 
const Admin = require("../models/admin");
const Client = require("../models/client.model.js");
const Supervisor = require("../models/supervisor.model.js");
const bcrpt = require("bcrypt")
const jwt = require("jsonwebtoken") 

require('dotenv').config()

exports.userlogin = async (req, res) => { 
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please provide email and password"
            })
        }

        let user = await User.findOne({ email }).select("+password") 

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const payload = {
            email: user.email,
            id: user._id,
        }

        if (await bcrpt.compare(password, user.password)) {
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
            user = user.toObject()
            user.token = token
            user.password = undefined

            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie("token", token, option).status(200).json({
                success: true,
                token, user, message: "user looged  succes"
            })

        } else {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials"
            })
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

exports.adminlogin = async (req, res) => { 
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please provide email and password"
            })
        }

        let admin = await Admin.findOne({ email }).select("+password") 

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const payload = {
            email: admin.email,
            id: admin._id,
        }

        if (await bcrpt.compare(password, admin.password)) {
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
            admin = admin.toObject()
            admin.token = token
            admin.password = undefined

            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie("token", token, option).status(200).json({
                success: true,
                token, admin, message: "admin looged  succes"
            })

        } else {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials"
            })
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

exports.clientlogin = async (req, res) => { 
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please provide email and password"
            })
        }

        let client = await Client.findOne({ email }).select("+password") 

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const payload = {
            email: client.email,
            id: client._id,
        }

        if (await bcrpt.compare(password, client.password)) {
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
            client = client.toObject()
            client.token = token
            client.password = undefined

            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie("token", token, option).status(200).json({
                success: true,
                token, client, message: "admin looged  succes"
            })

        } else {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials"
            })
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

exports.supervisorlogin = async (req, res) => { 
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please provide email and password"
            })
        }

        let supervisor = await Supervisor.findOne({ email }).select("+password") 

        if (!supervisor) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const payload = {
            email: supervisor.email,
            id: supervisor._id,
        }

        if (await bcrpt.compare(password, supervisor.password)) {
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
            supervisor = supervisor.toObject()
            supervisor.token = token
            supervisor.password = undefined

            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie("token", token, option).status(200).json({
                success: true,
                token, supervisor, message: "admin looged  succes"
            })

        } else {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials"
            })
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

exports.usersignup = async (req, res) => {
    try {
        console.log(req.body);
        const { userDetail, aadharData} = req.body
        const existingUser = await User.findOne({ email : userDetail.email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as user"
            })
        }

        const existingAdmin = await Admin.findOne({ email : userDetail.email })
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as establisment"
            })
        }

        const existingClient = await Client.findOne({ email : userDetail.email })
        if (existingClient) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as client"
            })
        }

        const existingSupervisor = await Supervisor.findOne({ email : userDetail.email })
        if (existingSupervisor) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as supervisor"
            })
        }

        const existingAadhar = await User.findOne({ aadhar_number : aadharData.aadhaar_number })
        if (existingAadhar) {
            return res.status(400).json({
                success: false,
                Message: "Aadhar already exists"
            })
        }

        let hashedpassword;
        try {
            hashedpassword = await bcrpt.hash(userDetail.password, 10)
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: "nahi hua hash"
            })
        }

        const newUser = await User.create({
            full_Name : aadharData.full_name,
            email : userDetail.email,
            password: hashedpassword, 
            contact : userDetail.contact,
            aadhar_number : aadharData.aadhaar_number,
            country : aadharData.address.country,
            dist : aadharData.address.dist,
            house : aadharData.address.house,
            landmark : aadharData.address.landmark,
            loc : aadharData.address.loc,
            po : aadharData.address.po,
            state : aadharData.address.state,
            street : aadharData.address.street,
            subdist : aadharData.address.subdist,
            vtc : aadharData.address.vtc,
            care_of : aadharData.care_of,
            dob : aadharData.dob,
            gender : aadharData.gender,
            has_image : aadharData.has_image,
            aadhar_image : aadharData.profile_image,
            zip : userDetail.zip
        })

        return res.status(200).json({
            success: true,
            message: "user created successfully"
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "plz try again later"
        })
    }
}

exports.adminsignup = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body
        const existingAdmin = await Admin.findOne({ email })
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as establisment"
            })
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({
                success: false,
                Message : "Email already exist as user"
            })
        }

        const existingClient = await Client.findOne({ email })
        if (existingClient) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as client"
            })
        }

        const existingSupervisor = await Supervisor.findOne({ email })
        if (existingSupervisor) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as supervisor"
            })
        }

        let hashedpassword;
        try {
            hashedpassword = await bcrpt.hash(password, 10)
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: "nahi hua hash"
            })
        }

        const newAdmin = await Admin.create({
            name, email, password: hashedpassword, contact, role: "establisment"
        })

        return res.status(200).json({
            success: true,
            message: "user created successfully"
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "plz try again later"
        })
    }
}

exports.clientregister = async (req, res) => {
    try {
        const { name, email, password, contact, state, location } = req.body
        
        console.log(req.body);
        if(!name || !email || !password || !contact || !state || !location){
            res.json({message : "Please Enter all the data", success : false});
        }
        
        const existingAdmin = await Admin.findOne({ email })
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as establisment"
            })
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({
                success: false,
                Message : "Email already exist as user"
            })
        }

        const existingClient = await Client.findOne({ email })
        if (existingClient) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as client"
            })
        }

        const existingSupervisor = await Supervisor.findOne({ email })
        if (existingSupervisor) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as supervisor"
            })
        }

        let hashedpassword;
        try {
            hashedpassword = await bcrpt.hash(password, 10)
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: "nahi hua hash"
            })
        }

        const currentEstablisment = await Admin.findOne({
                    _id : req.user.id
                  });

        const newClient = await Client.create({
            name, email, password: hashedpassword, contact, establisment: currentEstablisment._id, state, location
        })

        currentEstablisment.clients.push(newClient._id);
        await currentEstablisment.save();

        return res.status(200).json({
            success: true,
            message: "Client Registered"
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "plz try again later"
        })
    }
}

exports.supervisorregister = async (req, res) => {
    try {
        const { name, email, password, contact, } = req.body;

        if(!name || !email || !password || !contact ){
            res.json({message : "Please Enter all the data", success : false});
        }


        const existingAdmin = await Admin.findOne({ email })
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as establisment"
            })
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({
                success: false,
                Message : "Email already exist as user"
            })
        }

        const existingClient = await Client.findOne({ email })
        if (existingClient) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as client"
            })
        }

        const existingSupervisor = await Supervisor.findOne({ email })
        if (existingSupervisor) {
            return res.status(400).json({
                success: false,
                Message: "Email already exists as supervisor"
            })
        }

        let hashedpassword;
        try {
            hashedpassword = await bcrpt.hash(password, 10)
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: "nahi hua hash"
            })
        }

        const currentEstablisment = await Admin.findOne({
                    _id : req.user.id
                  });

        const newSupervisor = await Supervisor.create({
            name, email, password: hashedpassword, contact, establisment: currentEstablisment._id
        })

        currentEstablisment.supervisors.push(newSupervisor._id);
        await currentEstablisment.save();

        return res.status(200).json({
            success: true,
            message: "Supervisor Registered"
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "plz try again later"
        })
    }
}
