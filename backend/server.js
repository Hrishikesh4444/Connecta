import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import postRoutes from "./routes/post.routes.js"
import userRoutes from "./routes/user.routes.js"
dotenv.config()

const app=express()

app.use(cors())
app.use(express.json())
app.use(express.static("uploads"))

app.use(postRoutes)
app.use(userRoutes)

app.set('port',9000)
const start=async()=>{
    const connectDb=await mongoose.connect(process.env.MONGODB_URL)
        .then(()=>{
            console.log("MongoDb connected");
        })

    app.listen(app.get('port'),()=>{
        console.log("Listening on port 9000")
    })
}

start()









