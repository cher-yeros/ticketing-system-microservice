import { JwtPayload } from "jsonwebtoken";
import { UserAttrs } from "../models/user.model";

export interface CustomJwtPayload extends JwtPayload {
  user: UserAttrs;
}
