import { IAuthUser } from "~/models/users";
import { fetch } from ".";

/** --- Login --- */

export interface ILoginPayload {
  email: string;
  password: string;
}

export type ILoginResponse = IAuthUser;

export const login = async ({ email, password }: ILoginPayload): Promise<ILoginResponse> => {
  const { data } = await fetch.post("/sign-in", {
    email,
    password,
  });

  return data;
}

/** --- Signup --- */

export interface ISignupPayload {
  name: string;
  email: string;
  password: string;
}

export type ISignupResponse = IAuthUser;

export const signup = async ({ name, email, password }: ISignupPayload): Promise<ISignupResponse> => {
  const { data } = await fetch.post("/sign-up", {
    name,
    email,
    password,
  });

  return data;
}