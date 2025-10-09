import axios from "axios";
import { BASE_URL } from "@/constant/constant";
import { encodeToHexWithSpace } from "@/middleware";

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

  const response = await axios.post(
    `${BASE_URL}/auth/sign-in`,
    {
      "_": encodedToken,
    },
    {
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
    }
  );
  return response.data;
};
