import mongoose from "mongoose";

const EducationSchema=new mongoose.Schema({
    school:{
        type: String,
        default: ''
    },
    degree:{
        type: String,
        default: ''
    },
    fieldStudy:{
        type: String,
        default: ''
    }
})


const workSchema=new mongoose.Schema({
    company:{
        type: String,
        default: ''
    },
    position:{
        type: String,
        default: ''
    },
    years:{
        type: String,
        default: ''
    },
})

const ProfileSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bio:{
        type: String,
        default: ''
    },
    currentPost:{
        type: String,
        default: ''
    },
    education:{
        type: [EducationSchema],
        default: []
    },
    pastWork:{
        type: [workSchema],
        default: []
    },
    
})

const Profile=mongoose.model("Profile",ProfileSchema)

export default Profile