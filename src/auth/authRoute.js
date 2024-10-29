import {Router} from "express"
import { register } from "./register"
import getUser from "./getUser"
import { login } from "./login"

const authRoute = new Router()

authRoute.post("/api/register", register)
authRoute.get("/api/users", getUser)
authRoute.post("/api/login",login )

export default authRoute