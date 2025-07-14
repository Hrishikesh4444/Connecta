import User from "../models/user.model.js"
import Post from "../models/posts.model.js"
import Comment from "../models/comment.model.js"

const check=async(req,res)=>{
    return res.status(200).json({message: "running ok"})
}

const createPost=async(req,res)=>{
    const {token}=req.body
    
    try {
        const user=await User.findOne({token})

        if(!user) return res.status(404).json({message: "User not found"})

        const post=new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file !== undefined ? req.file.filename : "",
            fileType: req.file !== undefined ? req.file.mimetype.split("/")[1] : ""
        })
        await post.save()

        return res.json({message: "Post created"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const getAllPosts=async(req,res)=>{
    try {
        const posts=await Post.find().populate("userId","name username email profilePicture")

        return res.json({posts})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


const deletePost=async(req,res)=>{
    const {token,post_id}=req.body

    try {
        const user=await User.findOne({token: token}).select("_id")

        if(!user) return res.status(404).json({message: "User not found"})

        const post=await Post.findOne({_id: post_id})

        
        if(!post) return res.status(404).json({message: "Post not found"})

        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({message: "Unauthorized"})
        }

        await Post.deleteOne({_id: post_id})

         return res.json({message: "Post deleted"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}



const commentPost=async(req,res)=>{
    const {token,post_id,commentBody}=req.body
    try {
        const user=await User.findOne({token: token}).select("_id")

        if(!user) return res.status(404).json({message: "User not found"})

        const post=await Post.findOne({
            _id: post_id
        })

        if(!post) return res.status(404).json({message: "Post not found"})

        const newComment=new Comment({
            userId: user._id,
            postId: post_id,
            body: commentBody
        })

        await newComment.save()
        return res.json({message: "Comment added"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


const get_comments_by_post=async(req,res)=>{
    const {post_id}=req.query

    try {
        const post=await Post.findOne({_id: post_id})

        if(!post) return res.status(404).json({message: "Post not found"})

        const comments=await Comment.find({postId : post_id}).populate("userId","name username email profilePicture")

        comments.reverse()
        
        return res.json(comments)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


const delete_comment_of_user=async(req,res)=>{
    const {token,comment_id}=req.body
    try {
        const user=await User.findOne({token: token}).select("_id")

        if(!user) return res.status(404).json({message: "User not found"})

        const comment=await Comment.findOne({_id: comment_id})

        if(!comment) return res.status(404).json({message: "Comment not found"})

        if(comment.userId.toString() !== user._id.toString()){
            return res.status(401).json({message: "Unauthorized"})
        }

        await Comment.deleteOne({_id: comment_id})

        return res.json({message: "Comment deleted"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const incrementLikes=async(req,res)=>{
    const {token,post_id}=req.body

    try {
        const user=await User.findOne({token: token}).select("_id")

        if(!user) return res.status(404).json({message: "User not found"})

        const post=await Post.findOne({_id: post_id})

        if(!post) return res.status(404).json({message: "Post not found"})

        if (post.likedBy.includes(user._id)) {
            return res.status(400).json({ message: "You already liked this post" });
        }

        post.likes++

        post.likedBy.push(user._id)

        await post.save()

        return res.json({message: "Likes Incremented"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


export {check,createPost,getAllPosts,deletePost,commentPost,get_comments_by_post,delete_comment_of_user,incrementLikes}