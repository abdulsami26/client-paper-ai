import axios from "axios";
import { BASE_URL } from "@/constant/constant";

export const login = async (token: string) => {
  const response = await axios.post(
    `${BASE_URL}/auth/sign-in`,
    { token },
    {
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
      },
    }
  );

  return response.data.user;
};
