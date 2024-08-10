import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { SigninProps, signinSchema } from "@/lib/schemas/signin-schema";
import {userSignin} from "./services/queries/user-signin";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials) => {
        const { email, password, role } = credentials as SigninProps & {
          role: string;
        };

        if (role === "USER") {
          const parsedValues = signinSchema.safeParse({
            email,
            password,
          });

          if (!parsedValues.success) {
            const { errors } = parsedValues.error;
            console.log("zod validation error", errors);
            throw new Error("Invalid credentials");
          }

          const response = await userSignin(email)
          // console.log("response", response);

          if (!response) {
            throw new Error("Incorrect Email");
          }

          const passwordMatched = await bcrypt.compare(
            password,
            response.password
          );

          if (!passwordMatched) {
            throw new Error("Incorrect Password");
          }

          const user = {
            id: response.id,
            username: response.username,
            email: response.email,
            logoUrl: response.logoUrl,
            role: response.role,
          };

          return user;
        }

        // if (role === "ADMIN" || role === "GUEST_ADMIN") {
        //   const response = await prisma.admin.findUnique({
        //     where: {
        //       email: email,
        //     },
        //   });

        //   if (!response) {
        //     throw new Error("Incorrect Email");
        //   }

        //   if (response.password !== password) {
        //     throw new Error("Incorrect Password");
        //   }

        //   // console.log("auth response", response);

        //   const user = {
        //     id: response.id,
        //     email: response.email,
        //     role: response.role,
        //   };

        //   return user;
        // }

        return null;
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      // console.log("token", token);

      if (trigger === "update") {
        token.user = session.user;
      }

      if (user) {
        token.user = user;
      }

      return token;
    },

    session: ({ session, token }) => {
      if (token) {
        session.user = token.user as any;
      }

      // console.log("session IS", session);
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => getServerSession(authOptions);
