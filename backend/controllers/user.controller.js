import User from "../models/user.model.js"
import validator from "validator"
import bcrypt from "bcrypt"
import Profile from "../models/profile.model.js"
import crypto from "crypto"
import PDFDocument from "pdfkit"
import fs from "fs"
import Connection from "../models/connections.model.js"

const convertUserDataToPDF=(userData)=>{
    const doc=new PDFDocument()

    const outputPath=crypto.randomBytes(32).toString("hex")+".pdf"

    const stream=fs.createWriteStream("uploads/"+outputPath)

    doc.pipe(stream)

    doc.image(`uploads/${userData.userId.profilePicture}`,{align: "center",width: 100})
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${userData.userId.name}`)
    doc.moveDown();
    doc.fontSize(14).text(`Username: ${userData.userId.username}`)
    doc.moveDown();
    doc.fontSize(14).text(`Email: ${userData.userId.email}`)
    doc.moveDown();
    doc.fontSize(14).text(`Bio: ${userData.bio}`)
    doc.moveDown();
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`)
    doc.moveDown();
    doc.fontSize(14).text(`Past Work: `)
    userData.pastWork.forEach((work,index)=>{
        doc.fontSize(14).text(`Company Name: ${work.company}`)
        doc.fontSize(14).text(`Position: ${work.position}`)
        doc.fontSize(14).text(`Experience: ${work.years}`)
    })

    doc.end()

    return outputPath

}





const register=async(req,res)=>{
    try {
        const {name,email,username,password}=req.body;

        if(!name || !email || !username || !password) return res.status(400).json({message: "Please provide all details"})

        const user=await User.findOne({email})
      
        if(user) return res.status(400).json({message: "User already exist"})

        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Please provide a valid email"});
        }

        if(password.length < 8){
            return res.status(400).json({message: "Please enter a strong password"});
        }

        const hashedPassword=await bcrypt.hash(password,10)

        const newUser=new User({
            name,
            email,
            password: hashedPassword,
            username
        })

        await newUser.save()

        const profile=new Profile({userId: newUser._id})

        await profile.save()

        return res.status(201).json({message: "User created"})
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const login=async(req,res)=>{
    const {email,password}=req.body;

    try {
        if(!email || !password) return res.status(400).json({message: "Please provide all details"})

        const user=await User.findOne({email})
      
        if(!user) return res.status(404).json({message: "User does not exist"})

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token=crypto.randomBytes(32).toString("hex")

        await User.updateOne({_id: user._id},{token})

        return res.json({token})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const uploadProfilePicture=async(req,res)=>{
    const {token}=req.body

    try {
        const user=await User.findOne({token: token})

        if(!user) return res.status(404).json({message: "User does not exist"})

        user.profilePicture=req.file.filename

        await user.save()

        return res.json({message: "Profile picture updated"})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const updateUserProfile=async(req,res)=>{
    try {
        const {token,...newUser}=req.body

        const user=await User.findOne({token})

        if(!user) return res.status(404).json({message: "User not found"})

        const {username,email}=newUser

        const existingUser=await User.findOne({$or: [{username},{email}]})

        if(existingUser){
            if(String(existingUser._id)!==String(user._id)){
                return res.status(400).json({message: "User already exist"})
            }
        }

        Object.assign(user,newUser)

        await user.save()

        return res.json({message: "User updated"})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getUserAndProfile=async(req,res)=>{
    try {
        const {token}=req.query

        const user=await User.findOne({token: token})
        
        if(!user) return res.status(404).json({message: "User not found"})

        const userProfile=await Profile.findOne({userId: user._id}).populate('userId',"name email username profilePicture")

        return res.json(userProfile) 
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const updateProfileData=async(req,res)=>{
    try {
        const {token,...newProfileData}=req.body

        const user=await User.findOne({token: token})
        
        if(!user) return res.status(404).json({message: "User not found"})

        const profile=await Profile.findOne({userId: user._id})

        Object.assign(profile,newProfileData)

        await profile.save()

        return res.json({message: "Profile updated"})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getAllUserProfile=async(req,res)=>{
    try {
        const profiles=await Profile.find().populate("userId","name username email profilePicture")

        return res.json({profiles})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


const downloadProfile=async (req,res)=>{
    const user_id=req.query.id
    try {
        const userProfile=await Profile.findOne({userId: user_id}).populate("userId","name username email profilePicture")

        let outputPath=await convertUserDataToPDF(userProfile)


        return res.json({message: outputPath})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
    
}


const getUserProfileBasedOnUsername=async(req,res)=>{

    const {username}=req.query

    try {
        const user=await User.findOne({username})

        if(!user) return res.status(404).json({message: "User not found"})

        const userProfile=await Profile.findOne({userId: user._id}).populate('userId',"name username email profilePicture")

        return res.json({"profile": userProfile})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}







const sendConnectionRequest=async(req,res)=>{
    const {token,connectionId}=req.body

    try {
        const user=await User.findOne({token})

        if(!user) return res.status(404).json({message: "User not found"})

        const connectionUser=await User.findOne({_id: connectionId})

        if(!connectionUser){
            return res.status(404).json({message: "Connection User not found"})
        }

        if(user._id.toString() === connectionId.toString()) return res.status(400).json({message: "Can't send request to itself"})
            
        const existingRequest=await Connection.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        })

        if(existingRequest) return res.status(400).json({message: "Request already sent"})

        const request=new Connection({
            userId: user._id,
            connectionId: connectionUser._id
        })

        await request.save()

        return res.json({message: "Request sent"})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


const getMyConnectionRequest=async(req,res)=>{
    const {token}=req.query

    try {
        const user=await User.findOne({token})

        if(!user) return res.status(404).json({message: "User not found"})

        const connections=await Connection.find({connectionId: user._id}).populate("userId","name username email profilePicture")

        return res.json({connections})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


const getAllMyConnections=async(req,res)=>{
    const {token}=req.query
    
    try {
        const user=await User.findOne({token})

        if(!user) return res.status(404).json({message: "User not found"})

        const connections=await Connection.find({userId: user._id}).populate("connectionId","name username email profilePicture")

        return res.json({connections})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


const acceptConnectionRequest=async(req,res)=>{
    const {token,requestId,action_type}=req.body

    try {
        const user=await User.findOne({token})

        if(!user) return res.status(404).json({message: "User not found"})

        const connection=await Connection.findOne({_id: requestId})

        if(!connection) return res.status(404).json({message: "Connection not found"})

        if(action_type==="accept"){
            connection.status_accepted=true
        }
        else{
            connection.status_accepted=false
        }

        await connection.save()

        return res.json({message: "Request updated"})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export {register,login,uploadProfilePicture,updateUserProfile,getUserAndProfile,updateProfileData,getAllUserProfile,downloadProfile,sendConnectionRequest,getMyConnectionRequest,getAllMyConnections,acceptConnectionRequest,getUserProfileBasedOnUsername}