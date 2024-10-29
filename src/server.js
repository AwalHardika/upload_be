import express from "express"
import cors from "cors"
import env from "dotenv"
import authRoute from "./auth/authRoute"
import path from "path"
const app = express()

env.config()
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json({
    limit : "100mb"
}))
app.use(express.urlencoded({
    extended:true
}))

app.use(authRoute)


const PORT = process.env.PORT 

app.listen(PORT, ()=>{
    console.log(`
    Server Running on ${PORT}
    `)
})
