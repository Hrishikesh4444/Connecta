import { createSlice, isFulfilled } from "@reduxjs/toolkit"
import { getAboutUser, getAllUsers, getConnectionRequest, getMyConnectionRequests, loginUser, registerUser } from "../../action/authAction"

const initialState={
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    profileFetched: false,
    isToken: false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetched: false,
    myNetwork: []
}

const authSlice=createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset: () => (initialState),
        handleLoginUser: (state)=>{
            state.message="hello"
        },
        emptyMessage: (state)=>{
            state.message=""
        },
        setIsTokenThere: (state)=>{
            state.isToken=true
        },
        setIsTokenNotThere: (state)=>{
            state.isToken=false
        },
        setMyNetwork: (state)=>{
            
        }
    },
    extraReducers: (builder)=>{
        
        builder 
            .addCase(loginUser.pending,(state)=>{
                state.isLoading=true
                state.message={
                    message: "Loading..."
                }
            })
            .addCase(loginUser.fulfilled,(state,action)=>{
                state.isLoading=false
                state.isError=false
                state.isSuccess=true
                state.loggedIn=true
                state.message={
                    message: "Successfully logged in"
                }
            })
            .addCase(loginUser.rejected,(state,action)=>{
                state.isLoading=false
                state.isError=true
                state.message=action.payload
            })
            .addCase(registerUser.pending,(state)=>{
                state.isLoading=true
                state.message={
                    message: "Registering..."
                }
            })
            .addCase(registerUser.fulfilled,(state,action)=>{
                state.isLoading=false
                state.isError=false
                state.isSuccess=true
            
                state.message={
                    message: "Successfully registered. please log in"
                }
            })
            .addCase(registerUser.rejected,(state,action)=>{
                state.isLoading=false
                state.isError=true
                state.message=action.payload
            })
            .addCase(getAboutUser.pending,(state,action)=>{
                state.isLoading=true
                state.profileFetched=false
            })
            .addCase(getAboutUser.fulfilled,(state,action)=>{
                state.user=action.payload
                state.isLoading=false
                state.isError=false
                state.profileFetched= true
                
              
            })
            .addCase(getAllUsers.pending,(state)=>{
                state.isLoading=true
                state.isError=false
                state.message={
                    message: "Loading..."
                }
            })
            .addCase(getAllUsers.fulfilled,(state,action)=>{
                state.isLoading=false
                state.all_users=action.payload.profiles
                state.all_profiles_fetched=true
                state.isError=false
                
            })
            .addCase(getConnectionRequest.fulfilled,(state,action)=>{
                state.connections=action.payload
            })
            .addCase(getConnectionRequest.rejected,(state,action)=>{
                state.message=action.payload
            }
            )
            .addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
                state.isLoading=false
                state.connectionRequest=action.payload
            })
            .addCase(getMyConnectionRequests.rejected,(state,action)=>{
                state.isLoading=false
                state.message=action.payload
            })
            .addCase(getMyConnectionRequests.pending,(state)=>{
                state.isLoading=true
            })
            
    }
})

export const {reset,emptyMessage,setIsTokenNotThere,setIsTokenThere}=authSlice.actions

export default authSlice.reducer