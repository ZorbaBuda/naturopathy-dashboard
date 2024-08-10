'use server'

import connect from "@/lib/db"
import User from "@/lib/models/user.model"
import bcrypt from "bcrypt"

import { signupSchema, SignupProps } from "@/lib/schemas/signup-schema"
import { parseStringify } from "@/lib/utils"

export async function userSignup({values} : { values: SignupProps}) {

  const parsedBody = signupSchema.safeParse(values)

  if (!parsedBody.success) {
    const { errors } = parsedBody.error;
    return { error: "Invalid request", data: errors };
  }

  const { data } = parsedBody;
  const { username, email, password } = data;

  await connect();

  const usernameExists = await User.findOne({
    where: {
      username: username,
    },
  });

  const emailExists = await User.findOne({
    where: {
      email: email,
    },
  });

  if (usernameExists) {
    return { error: "Username already exists", errorType: "username" };
  }

  if (emailExists) {
    return { error: "Email already exists", errorType: "email" };
  }
  
  const saltValue = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltValue);

  try {
    const response = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (response.id) {
      return parseStringify({success: "Account created successfully"})
    }
  } catch (error) {
    console.log("errorData", error);

    return parseStringify({error: "something went wrong", data: error})
    
  }
   
  
}
