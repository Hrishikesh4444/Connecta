import { Router } from "express";
import { acceptConnectionRequest, downloadProfile, getAllMyConnections, getAllUserProfile, getMyConnectionRequest, getUserAndProfile, getUserProfileBasedOnUsername, login, register, sendConnectionRequest, updateProfileData, updateUserProfile, uploadProfilePicture } from "../controllers/user.controller.js";
import multer from "multer";

const router=Router()


const storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads')
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload=multer({storage: storage})


router.route("/upload_profile_picture").post(upload.single('profile_picture'),uploadProfilePicture)
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/user_update").post(updateUserProfile)
router.route("/get_user_and_profile").get(getUserAndProfile)
router.route("/update_profile_data").post(updateProfileData)
router.route("/user/get_all_users").get(getAllUserProfile)
router.route("/user/download_resume").get(downloadProfile)
router.route("/user/send_connection_request").post(sendConnectionRequest)
router.route("/user/get_connection_requests").get(getMyConnectionRequest)
router.route("/user/user_connection_request").get(getAllMyConnections)
router.route("/user/accept_connection_request").post(acceptConnectionRequest)
router.route("/user/get_profile").get(getUserProfileBasedOnUsername)

export default router