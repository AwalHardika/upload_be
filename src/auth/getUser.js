import { request, response } from "express";
import db from "../conn";


async function getUser(req = request, res = response){
try {
   const result = await db.user.findMany()
   
   res.json(result)
} catch (error) {
    console.log(error)
}
}


export default getUser