import { Router } from "express";
import { check, commentPost, createPost, delete_comment_of_user, deletePost, get_comments_by_post, getAllPosts, incrementLikes } from "../controllers/post.controller.js";
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

router.route("/").get(check)
router.route("/post").post(upload.single('media'),createPost)
router.route("/posts").get(getAllPosts)
router.route("/delete_post").post(deletePost)
router.route("/comment").post(commentPost)
router.route("/get_comments").get(get_comments_by_post)
router.route("/delete_comment").post(delete_comment_of_user)
router.route("/increment_post_like").post(incrementLikes)

export default router