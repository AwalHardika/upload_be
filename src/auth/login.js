import {request, response} from "express"
import db from "../conn"
import bycrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import env from "dotenv"

env.config()

async function login(req = request , res=response){
  const jwt_key = process.env.JWT_SECRET_KEY
try {
  const {email, password} = req.body    
  const emailCase = email.toLowerCase()
  const user = await db.user.findUnique({
    where : {
        email : emailCase 
    }
  }) 
  if(!user){
    return res.status(400).json({
        status : false,
        message : "User tidak ditemukan, silahkan cek email anda"
    })
  }
  const isPasswordValid = await bycrypt.compare(password, user.password)

  if(!isPasswordValid){
    return res.status(402).json({
        status : false,
        message : "password salah"
    })
  }

  const token = jwt.sign({userId : user.id}, jwt_key, {expiresIn : "1d"})

  res.json({
    message : "Login Berhasil",
    token
  })


} catch (error) {
    console.log(error)
    res.json(error)
}
}


export {
    login
}