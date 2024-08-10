"use server"
import  connect  from "@/lib/db"
import User from "@/lib/models/user.model"
import { parseStringify } from "@/lib/utils"

export async function userSignin(email: string) {

    try {

       await connect()
       const user = await User.findOne({email: email})  

       return user
    
    } catch (error) {
        console.log(error)
        return parseStringify({error: "something went wrong", data: error})
    }

  


  
  
}
