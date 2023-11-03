import { CookieOptions, Response } from "express";
import dayjs from "dayjs";

export const sendToken = ({ res, token }: { res: Response; token: string }) => {
  const options: CookieOptions = {
    httpOnly: true,
    expires: dayjs().add(3, "minute").toDate(),
    secure: false,
    sameSite: false,
  };

  res.cookie("token", token, options);
};
