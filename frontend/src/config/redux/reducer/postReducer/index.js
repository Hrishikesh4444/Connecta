import { createSlice } from "@reduxjs/toolkit"
import { getAllComments, getAllPosts } from "../../action/postAction"
import { getAboutUser } from "../../action/authAction"
import { act } from "react"


const initialState = {
    posts: [],
    isError: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    postFetched: false,
    comments: [],
    postId: "",
}

const postSlice=createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: ()=> initialState,
        resetPostId: (state)=>{
            state.postId=""
        },
        setPostId: (state,action)=>{
            state.postId=action.payload
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(getAllPosts.pending,(state)=>{
                state.message="Fetching all posts..."
                state.isLoading=true
            })
            .addCase(getAllPosts.fulfilled, (state,action)=>{
                state.isLoading=false
                state.isError=false
                state.postFetched=true
                state.posts=action.payload.posts.reverse()
            })
            .addCase(getAllPosts.rejected,(state,action)=>{
                state.isLoading=false
                state.isError=true
                state.message=action.payload
            })
            .addCase(getAllComments.fulfilled,(state,action)=>{
                state.postId=action.payload.post_id
                state.comments=action.payload.comments
            })
            
    }
})

export const {resetPostId,setPostId}=postSlice.actions

export default postSlice.reducer