import axios from "axios";
import { BASE_URL } from "@/constant/constant";
import { encodeToHexWithSpace, generateRequestSignature } from "@/utility";

const apiKey = import.meta.env.VITE_API_KEY;

export type LoginResponse = {
  status: boolean,
  user: {
    id: number;
    name: string;
    email: string;
    sub: string;
    picture: string;
  };
  token: string;
  expiresAt: string;
};

export const login = async (token: string): Promise<LoginResponse> => {
  const encodedToken = encodeToHexWithSpace({ "token": token });
  const body = { "_": encodedToken }
  const headers = await generateRequestSignature(body, apiKey);
  const response = await axios.post(
    `${BASE_URL}/auth/sign-in`,
    body, { headers: headers.headers }
  );
  return response.data;
};
