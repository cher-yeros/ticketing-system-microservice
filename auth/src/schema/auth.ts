import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../models/user.model";
import { sendToken } from "../services/auth";
import { CustomJwtPayload } from "../types/auth";
import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
} from "../utils/error_handler";
configDotenv();

export const authSchema = `#graphql 
    type User {
      _id: String
      email: String
      password: String
    }

    type UserPayload {
      success: Boolean!
      user: User
      token: String
    }

    type Query {
      me: User
    }

    type Mutation {
      createUser(email: String, password: String): User
      loginUser(email: String, password: String): UserPayload
      logoutUser: Boolean
    }
`;

export const authResolvers = {
  Query: {
    me: async (_: any, __: any, { req }: { req: Request }) => {
      const { token } = req.cookies;
      const secret = process.env.JWT_SECRET!;

      if (!token) {
        return new AuthorizationError("No Logged in User Found");
      }

      const { user } = jwt.verify(token, secret) as CustomJwtPayload;

      return user;
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { email, password }: { email: string; password: string },
      { res }: { res: Response }
    ) => {
      const userFound = await User.findOne({ email });

      if (userFound) {
        return new ConflictError("User already Exists!");
      }

      //   const compared = await bcrypt.compare(password, user.password)

      // const token = jwt.sign({ userFound }, process.env.JWT_SECRET as Secret);

      // const options: CookieOptions = {
      //   httpOnly: true,
      //   expires: dayjs().add(3, "minute").toDate(),
      //   secure: false,
      //   sameSite: false,
      // };

      // res.cookie("token", token, options);

      const newUser = await User.create({ email, password });

      return newUser;
    },
    loginUser: async (
      _: any,
      { email, password }: { email: string; password: string },
      { res }: { res: Response }
    ) => {
      const user = await User.findOne({ email });

      if (!user) {
        return new AuthenticationError("User does not exist!");
      }

      const compared = await bcrypt.compare(password, user.password);

      if (!compared) {
        return new AuthenticationError("Invalid password!");
      }

      const token = jwt.sign({ user }, process.env.JWT_SECRET as Secret);

      // console.log({ token });

      sendToken({ res, token });

      return { success: true, user, token };
    },
    logoutUser: async (_: any, __: any, { res }: { res: Response }) => {
      const result = res.clearCookie("token");

      return true;
    },
  },
  Subscription: {},
};
